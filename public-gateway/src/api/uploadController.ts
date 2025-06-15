import { defineStore } from "pinia";
import useHttpClient from "./httpClient";
import type { IUploadController } from "@/types/shared/fileUpload";
import { ref } from "vue";

interface IUploadResource {
  upload: (destination: string, file: File, uploadController: IUploadController) => Promise<any>;
}

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const useUploadController = defineStore("uploadController", () => {
  const httpClient = useHttpClient();

  async function upload(
    destination: string,
    file: File,
    uploadController: IUploadController,
  ): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const handler = httpClient.fileUploadRequest(BASE_URL + "/" + destination, formData);
    uploadController.cancel = handler.cancel;

    const response = await handler.caller();
    if (response.status !== "done") {
      throw new Error("File upload failed");
    }
    return response;
  }

  const uploadResource = ref<IUploadResource>({
    upload,
  });

  return uploadResource;
});

export default useUploadController;
