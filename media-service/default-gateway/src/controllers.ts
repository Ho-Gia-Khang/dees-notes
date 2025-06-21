import { Request, Response } from "express";
import fs from "fs-extra";
import path from "path";

import { uploadPath, uploadPathChunks } from "./constants";
import { IFileResponse } from "./models";
import {
  deleteFile,
  getAllFiles,
  getFileById,
  saveFile,
} from "./services/services";
import { delay } from "./utils";

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

async function getFilePath(fileName: string): Promise<string> {
  // Ensure the upload directories exist
  await fs.mkdir(uploadPath, { recursive: true });

  return path.join(uploadPath, fileName);
}

async function getFileTempPath(
  fileName: string,
  part: number
): Promise<string> {
  await fs.mkdir(uploadPathChunks, { recursive: true });
  return path.join(uploadPathChunks, `${fileName}.part_${part}`);
}

export async function getDocumentsList(req: Request, res: Response) {
  const userId = req.params?.userId as string;
  if (!userId) {
    res.status(400).send({ message: "User ID is required." });
    return;
  }

  const items = await getAllFiles(userId);
  const totals = items.length;
  res.status(200).send({
    items,
    totals,
  });
}

async function mergeChunks(fileName: string, totalChunks: number) {
  const filePath = await getFilePath(fileName);
  console.log(" filePath:", filePath);
  const writeStream = fs.createWriteStream(filePath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = await getFileTempPath(fileName, i);
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const chunkStream = fs.createReadStream(chunkPath);
        await new Promise<void>((resolve, reject) => {
          chunkStream.pipe(writeStream, { end: false });
          chunkStream.on("end", resolve);
          chunkStream.on("error", reject);
        });
        console.log(`Chunk ${i} merged successfully`);
        await fs.promises.unlink(chunkPath);
        console.log(`Chunk ${i} deleted successfully`);
        break; // Success, move to next chunk
      } catch (error: any) {
        if (error.code === "EBUSY") {
          console.log(
            `Chunk ${i} is busy, retrying... (${retries + 1}/${MAX_RETRIES})`
          );
          await delay(RETRY_DELAY);
          retries++;
        } else {
          throw error; // Unexpected error, rethrow
        }
      }
    }

    if (retries === MAX_RETRIES) {
      console.error(`Failed to merge chunk ${i} after ${MAX_RETRIES} retries`);
      writeStream.end();
      throw new Error(`Failed to merge chunk ${i}`);
    }
  }

  writeStream.end();
  console.log("Chunks merged successfully");
}

export async function handleUpload(req: Request, res: Response) {
  const userId = req.body.userId as string;
  if (!userId) {
    res.status(400).send({ message: "User ID is required." });
    return;
  }

  if (!req.file) {
    res.status(400).send({ message: "No video file uploaded." });
    return;
  }

  try {
    const chunkNumber = Number(req.body.chunkNumber);
    const totalChunks = Number(req.body.totalChunk);
    const fileName = req.body.originalname.replace(/\s+/g, "");

    if (chunkNumber === totalChunks - 1) {
      await mergeChunks(fileName, totalChunks);
    }

    const fileInfo = {
      filename: fileName,
      size: req.file.size,
      mimetype: req.file.mimetype,
    };

    res.status(200).send({
      message: "Chunk uploaded successfully",
      file: fileInfo,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res
      .status(500)
      .send({ message: "An error occurred while uploading the video." });
  }
}

export async function handleUploadComplete(req: Request, res: Response) {
  const userId = req.body.userId as string;

  if (!userId) {
    res.status(400).send({ message: "User ID is required." });
    return;
  }

  const userName = req.body.userName as string;
  if (!userName) {
    res.status(400).send({ message: "User name is required." });
    return;
  }

  const fileName = req.body.fileName as string;
  if (!fileName) {
    res.status(400).send({ message: "File name is required." });
  }

  const fileSize = req.body.fileSize as number;
  if (!fileSize) {
    res.status(400).send({ message: "File size is required." });
  }

  const mimetype = req.body.mimetype as string;
  if (!mimetype) {
    res.status(400).send({ message: "File type is required." });
    return;
  }

  const type = mimetype.split("/")[1];
  const savedFile = await saveFile({
    userId,
    name: fileName,
    uploadedBy: userName,
    size: fileSize,
    type,
  });

  const response: IFileResponse = {
    id: savedFile.id,
    name: fileName,
    size: fileSize,
    type,
    uploadedAt: savedFile.uploadedAt.toISOString(),
    uploadedBy: savedFile.uploadedBy,
  };

  res.status(200).send(response);
}

export async function handleDownloadFile(req: Request, res: Response) {
  const userId = req.query?.userId as string;
  if (userId === undefined || userId === null) {
    res.status(400).send({ message: "User ID is required." });
    return;
  }

  const fileId = req.params?.id as string;
  if (!fileId) {
    res.status(400).send({ message: "File ID is required." });
    return;
  }
  const file = await getFileById(fileId);
  if (!file) {
    res.status(404).send({ message: "File not found in database." });
    return;
  }

  const filePath = await getFilePath(file.name);
  if (!fs.existsSync(filePath)) {
    res.status(404).send({ message: "File not found in system." });
    await deleteFile(fileId);
    return;
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(500).send({ message: "Failed to download file." });
    }
  });
}

export async function handleDeleteFile(req: Request, res: Response) {
  const userId = req.query?.userId;
  if (userId === undefined || userId === null) {
    res.status(400).send({ message: "User ID is required." });
    return;
  }

  const fileId = req.params.id;
  if (!fileId) {
    res.status(400).send({ message: "File ID is required." });
    return;
  }

  const file = await getFileById(fileId);
  if (!file) {
    res.status(404).send({ message: "File not found." });
    return;
  }

  if (file.userId !== userId) {
    res
      .status(403)
      .send({ message: "You do not have permission to delete this file." });
    return;
  }

  const filePath = await getFilePath(file.name);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("File deletion error:", err);
    }
  });
  await deleteFile(fileId);
  res.status(200).send({ message: "File deleted successfully." });
}
