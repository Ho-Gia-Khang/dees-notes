export enum EUploadStatus {
  Idle = "idle",
  Pending = "Pending",
  Uploading = "uploading",
  Done = "done",
  Error = "error",
  Canceled = "canceled",
}

export interface IFileIntermediate {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  uploadedAt?: String;
  uploadedBy?: string;
  status: EUploadStatus;
  error?: string;
  task?: {
    cancel: () => Promise<void>;
    retry: () => Promise<void>;
  };
}

export interface IUploadController {
  cancel?: () => Promise<void>;
}
