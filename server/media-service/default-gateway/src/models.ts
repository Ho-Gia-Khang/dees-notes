export interface IFile {
  id: string;
  name: string;
  size: number;
  type: string;
  userId: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface IFileInput extends Omit<IFile, "id" | "uploadedAt"> {}

export interface IFileResponse extends Omit<IFile, "userId"> {}
