import type { IUploadController } from "@/types/shared/fileUpload";
import useHttpClient from "./httpClient";
import useAuthStore from "@/stores/auth";
import { CHUNK_SIZE } from "@/constants";
import { ref } from "vue";

interface IUploadResource {
  upload: (destination: string, file: File, uploadController: IUploadController) => Promise<any>;
}
interface IChunkedUploadRequest {
  chunk: Blob;
  fileName: string;
  chunkNumber: number;
  totalChunk: number;
  controller: AbortController;
  destination: string;
}

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export function provideChunkedUploadController() {
  const uploadConfig = {
    retryLimit: 3,
    retryDelay: 1000, // milliseconds
    concurrencyLimit: 3,
  };

  const httpClient = useHttpClient();
  const { state } = useAuthStore();

  async function uploadChunk(payload: IChunkedUploadRequest) {
    const url = `${BASE_URL}/${payload.destination}/uploadVideo`;
    const formData = new FormData();

    formData.append("video", payload.chunk, payload.fileName);
    formData.append("originalname", payload.fileName);
    formData.append("chunkNumber", payload.chunkNumber.toString());
    formData.append("totalChunk", payload.totalChunk.toString());
    formData.append("userId", state.userId);
    formData.append("userName", state.userName);

    let attempts = 0;
    while (attempts < uploadConfig.retryLimit) {
      try {
        const response = await httpClient
          .fileUploadRequest(url, formData, payload.controller)
          .caller();

        if (!response) {
          throw new Error("File upload failed");
        }
        return response;
      } catch (error) {
        attempts++;
        if (attempts >= uploadConfig.retryLimit) {
          throw new Error(`Failed to upload chunk: ${error}`);
        }
        await new Promise((resolve) => setTimeout(resolve, uploadConfig.retryDelay));
      }
    }
  }

  async function upload(destination: string, file: File, uploadController: IUploadController) {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const controller = new AbortController();

    async function cancel() {
      controller.abort();
    }

    const uploadPromises: Promise<any>[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const payload: IChunkedUploadRequest = {
        chunk,
        fileName: file.name,
        chunkNumber: i,
        totalChunk: totalChunks,
        controller,
        destination,
      };

      uploadPromises.push(uploadChunk(payload));
    }

    uploadController.cancel = cancel;
    try {
      for (let i = 0; i < uploadPromises.length; i += uploadConfig.concurrencyLimit) {
        const batch = uploadPromises.slice(i, i + uploadConfig.concurrencyLimit);
        await Promise.all(batch);
      }
    } catch (error) {
      throw error; // Re-throw to handle it in the calling context
    }
    // Process uploads in batches to respect concurrency limit

    return await httpClient.httpPost(`${BASE_URL}/${destination}/uploadVideoComplete`, {
      fileName: file.name,
      fileSize: file.size,
      mimetype: file.type,
      userId: state.userId,
      userName: state.userName,
      totalChunks,
    });
  }

  const uploadResource = ref<IUploadResource>({
    upload,
  });

  return uploadResource;
}
