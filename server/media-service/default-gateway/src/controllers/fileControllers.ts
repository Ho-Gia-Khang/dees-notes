import { Request, Response } from "express";
import fs from "fs-extra";
import path from "path";

import { uploadPath, uploadPathChunks } from "../constants";
import {
  deleteFile,
  getAllFiles,
  getFileById,
  saveFile,
} from "../services/fileServices";
import { delay, normalizeFileName } from "../utils";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  EFileType,
  IApiError,
  IFileResponse,
  PaginatedResponse,
} from "@dees-notes/shared-module";

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

function getFilePath(fileName: string): string {
  return path.join(uploadPath, fileName);
}

function getFileTempPath(fileName: string, part: number): string {
  return path.join(uploadPathChunks, `${fileName}.part_${part}`);
}

export async function getFilesListHandler(req: Request, res: Response) {
  const userId = req.query?.userId as string;
  if (!userId) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const folderId = req.params?.folderId as string;
  if (!folderId) {
    const errMsg: IApiError = {
      message: {
        folderId: "Folder ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const page = Number(req.query?.page) || DEFAULT_PAGE;
  const pageSize = Number(req.query?.pageSize) || DEFAULT_PAGE_SIZE;

  try {
    const queriedData = await getAllFiles(userId, folderId, page, pageSize);

    const response: PaginatedResponse<IFileResponse> = {
      items: queriedData.items,
      total: queriedData.total,
    };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching files:", error);
    const errorMsg: IApiError = {
      message: {
        Fetching_files: error as string,
      },
    };
    res.status(500).send(errorMsg);
  }
}

async function mergeChunks(fileName: string, totalChunks: number) {
  const filePath = getFilePath(fileName);
  const writeStream = fs.createWriteStream(filePath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = getFileTempPath(fileName, i);
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

export async function handleUploadImage(req: Request, res: Response) {
  const userId = req.body.userId as string;
  if (!userId) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }
  const userName = req.body.userName as string;
  if (!userName) {
    const errMsg: IApiError = {
      message: {
        userName: "User name is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  if (!req.file) {
    const errMsg: IApiError = {
      message: {
        file: "No image file uploaded.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const fileName = normalizeFileName(req.body.originalname as string);
  if (!fileName) {
    const errMsg: IApiError = {
      message: {
        fileName: "originalname name is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const folderId = req.body.folderId as string;
  if (!folderId) {
    const errMsg: IApiError = {
      message: {
        folderId: "Folder ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const fileSize = req.file.size as number;

  const mimetype = req.file.mimetype as string;

  const extension = mimetype.split("/")[1];
  const savedFile = await saveFile({
    userId,
    name: fileName,
    uploadedBy: userName,
    size: fileSize,
    type: EFileType.MEDIA,
    extension,
    folderId,
  });

  fs.rename(getFilePath(fileName), getFilePath(savedFile.id), (err) => {
    if (err) {
      console.error("Error renaming file:", err);
    }
  });

  const response: IFileResponse = {
    id: savedFile.id,
    name: fileName,
    size: fileSize,
    type: EFileType.MEDIA,
    folderId,
    extension,
    uploadedAt: savedFile.uploadedAt,
    uploadedBy: savedFile.uploadedBy,
  };

  res.status(200).send(response);
}

export async function handleUploadVideo(req: Request, res: Response) {
  const userId = req.body.userId as string;
  if (!userId) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  if (!req.file) {
    const errMsg: IApiError = {
      message: {
        file: "No video file uploaded.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  try {
    const chunkNumber = Number(req.body.chunkNumber);
    const totalChunks = Number(req.body.totalChunk);
    const fileName = normalizeFileName(req.body.originalname as string);
    if (!fileName) {
      const errMsg: IApiError = {
        message: {
          fileName: "originalname name is required.",
        },
      };
      res.status(400).send(errMsg);
      return;
    }

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

export async function handleUploadVideoComplete(req: Request, res: Response) {
  const userId = req.body.userId as string;

  if (!userId) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const userName = req.body.userName as string;
  if (!userName) {
    const errMsg: IApiError = {
      message: {
        userName: "User name is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const fileName = req.body.fileName as string;
  if (!fileName) {
    const errMsg: IApiError = {
      message: {
        fileName: "originalname name is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const fileSize = req.body.fileSize as number;
  if (!fileSize) {
    const errMsg: IApiError = {
      message: {
        fileSize: "File size is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const mimetype = req.body.mimetype as string;
  if (!mimetype) {
    const errMsg: IApiError = {
      message: {
        mimetype: "File type is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const folderId = req.body.folderId as string;
  if (!folderId) {
    const errMsg: IApiError = {
      message: {
        folderId: "Folder ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const extension = mimetype.split("/")[1];
  const savedFile = await saveFile({
    userId,
    name: fileName,
    uploadedBy: userName,
    size: fileSize,
    type: EFileType.MEDIA,
    extension,
    folderId,
  });

  fs.rename(getFilePath(fileName), getFilePath(savedFile.id), (err) => {
    if (err) {
      console.error("Error renaming file:", err);
    }
  });

  const response: IFileResponse = {
    id: savedFile.id,
    name: fileName,
    size: fileSize,
    type: EFileType.MEDIA,
    extension,
    folderId,
    uploadedAt: savedFile.uploadedAt,
    uploadedBy: savedFile.uploadedBy,
  };

  res.status(200).send(response);
}

export async function handleDownloadFile(req: Request, res: Response) {
  const userId = req.query?.userId as string;
  if (userId === undefined || userId === null) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const fileId = req.params?.id as string;
  if (!fileId) {
    const errMsg: IApiError = {
      message: {
        fileId: "File ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }
  const file = await getFileById(fileId);
  if (!file) {
    const errMsg: IApiError = {
      message: {
        fileId: "File not found in database.",
      },
    };
    res.status(404).send(errMsg);
    return;
  }

  const filePath = getFilePath(fileId);
  if (!fs.existsSync(filePath)) {
    const errMsg: IApiError = {
      message: {
        fileId: "File not found in system.",
      },
    };
    res.status(404).send(errMsg);
    await deleteFile(fileId);
    return;
  }

  res.download(filePath, (err) => {
    if (err) {
      const errMsg: IApiError = {
        message: {
          filePath: "Failed to download file.",
        },
      };
      res.status(500).send(errMsg);
    }
  });
}

export async function handleDeleteFile(req: Request, res: Response) {
  const userId = req.query?.userId;
  if (userId === undefined || userId === null) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const fileId = req.params.id;
  if (!fileId) {
    const errMsg: IApiError = {
      message: {
        fileId: "File ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const file = await getFileById(fileId);
  if (!file) {
    const errMsg: IApiError = {
      message: {
        fileId: "File not found.",
      },
    };
    res.status(404).send(errMsg);
    return;
  }

  if (file.userId !== userId) {
    const errMsg: IApiError = {
      message: {
        fileId: "You do not have permission to delete this file.",
      },
    };
    res.status(403).send(errMsg);
    return;
  }

  try {
    const filePath = getFilePath(fileId);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("File deletion error:", err);
      }
    });
    await deleteFile(fileId);
    res.status(200).send({ message: "File deleted successfully." });
  } catch (err: any) {
    const errMsg: IApiError = {
      message: {
        filePath: "Failed to delete file.",
      },
    };
    res.status(500).send(errMsg);
  }
}
