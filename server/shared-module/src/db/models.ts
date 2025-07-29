import { File } from "@prisma/client";
import { DatabaseOperations } from "./operations";
import { IFile, IFileInput, IFileResponse } from "../models/file";

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

// Export instances of each model's operations
export const fileOperations = new FileOperations();

// You can add more model operations here as you add more models to your schema
