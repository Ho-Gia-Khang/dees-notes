import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@dees-notes/shared-module/dist/constants";
import {
  IApiError,
  IFolderResponse,
  PaginatedResponse,
} from "@dees-notes/shared-module/dist/types";
import { type Request, type Response } from "express";
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  getFolderById,
} from "../services/folderServices";
import { ROOT_FOLDER_ID } from "../constants";
import { deleteFile, getAllFiles } from "../services/fileServices";

export async function getFoldersListHandler(req: Request, res: Response) {
  const userId = req.params?.userId as string;
  if (!userId) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const page = Number(req.query?.page) || DEFAULT_PAGE;
  const pageSize = Number(req.query?.pageSize) || DEFAULT_PAGE_SIZE;

  try {
    const queriedData = await getAllFolders(userId, page, pageSize);

    const response: PaginatedResponse<IFolderResponse> = {
      items: queriedData.items,
      total: queriedData.total,
    };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching folders:", error);
    const errorMsg: IApiError = {
      message: {
        Fetching_folders: error as string,
      },
    };
    res.status(500).send(errorMsg);
  }
}

export async function getRootFolderHandler(req: Request, res: Response) {
  const userId = req.params?.userId as string;
  if (!userId) {
    const errMsg: IApiError = {
      message: {
        userId: "User ID is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  try {
    const folder = await getFolderById(ROOT_FOLDER_ID);
    res.status(200).send(folder);
  } catch (error) {
    console.error("Error fetching root folder:", error);
    const errorMsg: IApiError = {
      message: {
        Fetching_root_folder: error as string,
      },
    };
    res.status(500).send(errorMsg);
  }
}

export async function createFolderHandler(req: Request, res: Response) {
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

  const folderName = req.body.folderName as string;
  if (!folderName) {
    const errMsg: IApiError = {
      message: {
        folderName: "Folder name is required.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  const folder = await createFolder({
    userId,
    name: folderName,
  });

  res.status(200).send(folder);
}

export async function deleteFolderHandler(req: Request, res: Response) {
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

  const folder = await getFolderById(folderId);

  if (!folder) {
    const errMsg: IApiError = {
      message: {
        folderId: "Folder not found.",
      },
    };
    res.status(404).send(errMsg);
    return;
  }

  if (folder.id === ROOT_FOLDER_ID) {
    const errMsg: IApiError = {
      message: {
        folderId: "You cannot delete root folder.",
      },
    };
    res.status(400).send(errMsg);
    return;
  }

  if (folder.userId !== userId) {
    const errMsg: IApiError = {
      message: {
        folderId: "You do not have permission to delete this folder.",
      },
    };
    res.status(403).send(errMsg);
    return;
  }

  try {
    let isFilesLeft = true;
    let page = 0;
    const pageSize = 100;
    while (isFilesLeft) {
      const files = await getAllFiles(userId, folderId, page, pageSize);
      if (files.items.length < pageSize) {
        isFilesLeft = false;
      }
      files.items.forEach(async (file) => {
        await deleteFile(file.id);
      });
      page++;
    }
    await deleteFolder(folderId);

    res.status(200).send({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    const errorMsg: IApiError = {
      message: {
        Deleting_folder: error as string,
      },
    };
    res.status(500).send(errorMsg);
  }
}
