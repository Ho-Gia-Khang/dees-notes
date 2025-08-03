import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload/index";
import path from "path";
import fs from "fs-extra";

import {
  deleteFile,
  getAllFiles,
  getFileById,
  saveFile,
} from "../services/fileServices";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@dees-notes/shared-module/dist/constants";
import {
  IApiError,
  IFileResponse,
  PaginatedResponse,
} from "@dees-notes/shared-module/dist/types";
import { EFileType } from "@dees-notes/shared-module";

const uploadPath = path.join(__dirname, "../assets");

async function getFilePath(fileId: string, ext: string): Promise<string> {
  // Ensure the upload directories exist
  await fs.mkdir(uploadPath, { recursive: true });

  return path.join(uploadPath, fileId + "." + ext);
}

export async function getDocumentsListHandler(req: Request, res: Response) {
  const userId = req.query?.userId as string;
  if (!userId) {
    res.status(400).send({ message: "User ID is required." });
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

  // We only support a single file upload at the moment
  if (Object.keys(files).length > 1) {
    res.status(400).send({ message: "Multiple files are not supported." });
    return;
  }

  const file = files[Object.keys(files)[0]] as UploadedFile;
  const extension = file.mimetype.split("/")[1];

  const savedFile = await saveFile({
    userId,
    name: file.name,
    uploadedBy: userName,
    size: file.size,
    folderId,
    extension,
    type: EFileType.DOCUMENT,
  });

  const filePath = await getFilePath(savedFile.id, extension);
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
    type: EFileType.DOCUMENT,
    folderId,
    extension,
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

  const filePath = await getFilePath(fileId, file.extension);
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
