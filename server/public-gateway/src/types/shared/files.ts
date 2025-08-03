export interface IFile {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  url: string;
  folderId: string;
  uploadedAt: Date;
}

export interface IFolder {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
