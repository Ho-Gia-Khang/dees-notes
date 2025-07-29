import { fileOperations, IFileInput } from "@dees-notes/shared-module";

export async function getAllFiles(userId: string) {
  try {
    // Using the fileOperations from shared module
    return await fileOperations.findByUserId(userId);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching files");
  }
}

export async function getFileById(fileId: string) {
  try {
    // Using the fileOperations from shared module
    return await fileOperations.findById(fileId);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching file");
  }
}

export async function saveFile(newFile: IFileInput) {
  try {
    // Using the fileOperations from shared module
    // Use type assertion to bypass TypeScript checking
    // Since uploadedAt has a default value in Prisma schema
    return await fileOperations.create(newFile);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error saving file");
  }
}

export async function deleteFile(fileId: string) {
  try {
    // Using the fileOperations from shared module
    await fileOperations.delete(fileId);
  } catch (err: any) {
    console.error(err);
    throw new Error("Error deleting file");
  }
}
