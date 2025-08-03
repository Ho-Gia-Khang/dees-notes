import {
  EFileType,
  fileOperations,
  IFileInput,
} from "@dees-notes/shared-module";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@dees-notes/shared-module/dist/constants";

export async function getAllFiles(
  userId: string,
  folderId: string,
  page: number = DEFAULT_PAGE,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  try {
    return fileOperations.findPaginated({
      where: {
        userId,
        type: EFileType.DOCUMENT,
        folderId,
      },
      pagination: {
        page,
        pageSize,
      },
    });
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching files");
  }
}

export async function getFileById(fileId: string) {
  try {
    return await fileOperations.findById(fileId);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching file");
  }
}

export async function saveFile(newFile: IFileInput) {
  try {
    const file = await fileOperations.create(newFile);
    return file;
  } catch (err: any) {
    console.error(err);
    throw new Error("Error saving file");
  }
}

export async function deleteFile(fileId: string) {
  try {
    await fileOperations.delete(fileId);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error deleting file");
  }
}
