/**
 * File-related interfaces for use across services
 */

import { EFileType } from "@prisma/client";

/**
 * Base file interface matching Prisma schema
 */
export interface IFile {
  id: string;
  name: string;
  size: number;
  type: EFileType;
  userId: string;
  extension: string;
  uploadedAt: Date; // Using Date type to match Prisma schema
  uploadedBy: string;
}

/**
 * Input interface for creating new files
 * Omits id and uploadedAt (which has a default value in Prisma)
 */
export interface IFileInput extends Omit<IFile, "id" | "uploadedAt"> {}

/**
 * Response interface for client-facing data
 * Omits userId for privacy/security
 * Allows uploadedAt to be either Date or string for flexibility in API responses
 */
export interface IFileResponse extends Omit<IFile, "userId" | "uploadedAt"> {
  uploadedAt: Date | string;
}
