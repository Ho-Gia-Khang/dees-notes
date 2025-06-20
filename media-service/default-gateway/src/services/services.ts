import { IFileInput } from "../models";
import prisma from "./client";

export async function getAllFiles(userId: string) {
  try {
    return await prisma.file.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching files");
  }
}

export async function getFileById(fileId: string) {
  try {
    return await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });
  } catch (err: any) {
    console.error(err);
    throw new Error("Error fetching file");
  }
}

export async function saveFile(newFile: IFileInput) {
  try {
    const file = await prisma.file.create({
      data: newFile,
    });
    return file;
  } catch (err: any) {
    console.error(err);
    throw new Error("Error saving file");
  }
}

export async function deleteFile(fileId: string) {
  try {
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  } catch (err: any) {
    console.error(err);
    throw new Error("Error deleting file");
  }
}
