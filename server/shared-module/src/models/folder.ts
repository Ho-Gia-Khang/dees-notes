/**
 * Folder-related interfaces for use across services
 */

/**
 * Base folder interface matching Prisma schema
 */
export interface IFolder {
  id: string;
  name: string;
  userId: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input interface for creating new folders
 * Omits createdAt and updatedAt (which have default values in Prisma)
 * Makes id optional to allow custom id specification
 */
export interface IFolderInput
  extends Omit<IFolder, "id" | "createdAt" | "updatedAt"> {
  id?: string; // Optional id parameter for custom folder creation
}

/**
 * Response interface for client-facing data
 * Allows dates to be either Date or string for flexibility in API responses
 */
export interface IFolderResponse
  extends Omit<IFolder, "createdAt" | "updatedAt"> {
  createdAt: Date | string;
  updatedAt: Date | string;
}
