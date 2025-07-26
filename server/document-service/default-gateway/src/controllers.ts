import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload/index";
import path from "path";
import fs from "fs-extra";

import { IFileResponse } from "./models";
import {
  deleteFile,
  getAllFiles,
  getFileById,
  saveFile,
} from "./services/services";

const uploadPath = path.join(__dirname, "../assets");

async function getFilePath(fileId: string, ext: string): Promise<string> {
  // Ensure the upload directories exist
  await fs.mkdir(uploadPath, { recursive: true });

  return path.join(uploadPath, fileId + "." + ext);
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

export async function handleUpload(req: Request, res: Response) {
  const userId = req.body.userId as string;
  const userName = req.body.userName as string;
  if (!userId) {
    res.status(400).send({ message: "User ID is required." });
    return;
  }
  const files = req.files;

  if (!files) {
    res.sendStatus(400).send({ message: "No files were uploaded." });
    return;
  }

  // We only support a single file upload at the moment
  if (Object.keys(files).length > 1) {
    res.status(400).send({ message: "Multiple files are not supported." });
    return;
  }

  const file = files[Object.keys(files)[0]] as UploadedFile;
  const type = file.mimetype.split("/")[1];

  const savedFile = await saveFile({
    userId,
    name: file.name,
    uploadedBy: userName,
    size: file.size,
    type,
  });

  const filePath = await getFilePath(savedFile.id, type);
  file.mv(filePath, (err) => {
    if (err) {
      console.error("File upload error:", err);
      res.status(500).send({ message: "Failed to upload file." });
      return;
    }
  });

  const response: IFileResponse = {
    id: savedFile.id,
    name: file.name,
    size: file.size,
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

  const filePath = await getFilePath(fileId, file.type);
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

  const filePath = await getFilePath(fileId, file.type);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("File deletion error:", err);
    }
  });
  await deleteFile(fileId);
  res.status(200).send({ message: "File deleted successfully." });
}
