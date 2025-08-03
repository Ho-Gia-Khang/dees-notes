import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  folderOperations,
  IFolderInput,
} from "@dees-notes/shared-module";
import { ROOT_FOLDER_ID } from "../constants";

export async function checkRootFolder() {
  const folder = await folderOperations.findById(ROOT_FOLDER_ID);
  return !!folder;
}

export async function getAllFolders(
  userId: string,
  page: number = DEFAULT_PAGE,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  try {
    // Using the fileOperations from shared module
    return await folderOperations.findPaginated({
      where: {
        userId,
      },
      pagination: {
        page,
        pageSize,
      },
    });
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching folders");
  }
}

export async function getFolderById(folderId: string) {
  try {
    // Using the fileOperations from shared module
    return await folderOperations.findById(folderId);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching folder by Id");
  }
}

export async function createFolder(newFolder: IFolderInput) {
  try {
    // Using the fileOperations from shared module
    // Use type assertion to bypass TypeScript checking
    // Since uploadedAt has a default value in Prisma schema
    return await folderOperations.create(newFolder);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error saving folder");
  }
}

export async function deleteFolder(folderId: string) {
  try {
    // Using the fileOperations from shared module
    await folderOperations.delete(folderId);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error deleting folder");
  }
}
