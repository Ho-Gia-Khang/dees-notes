import { File, Folder } from "@prisma/client";
import { IFileInput } from "../models/file";
import { IFolderInput } from "../models/folder";
import { DatabaseOperations } from "./operations";

// File model operations
export class FileOperations extends DatabaseOperations<File> {
  constructor() {
    super("File");
  }

  /**
   * Create a new file
   * @param data File input data
   * @returns Created file
   */
  async create(data: IFileInput): Promise<File> {
    return super.create(data);
  }

  // Add any File-specific operations here
  async findByUserId(userId: string): Promise<File[]> {
    return this.findMany({ where: { userId } });
  }

  async findByType(type: string): Promise<File[]> {
    return this.findMany({ where: { type } });
  }
}

// Folder model operations
export class FolderOperations extends DatabaseOperations<Folder> {
  constructor() {
    super("Folder");
  }

  /**
   * Create a new folder with optional custom id
   * @param data Folder input data with optional id
   * @returns Created folder
   */
  async create(data: IFolderInput): Promise<Folder> {
    // If id is provided, include it in the create data
    const createData = data.id ? data : { ...data };
    return super.create(createData);
  }

  // Add any Folder-specific operations here
  async findByUserId(userId: string): Promise<Folder[]> {
    return this.findMany({ where: { userId } });
  }

  async findByName(name: string, userId: string): Promise<Folder | null> {
    const folders = await this.findMany({ where: { name, userId } });
    return folders[0] || null;
  }
}

// Export instances of each model's operations
export const fileOperations = new FileOperations();
export const folderOperations = new FolderOperations();

// You can add more model operations here as you add more models to your schema
