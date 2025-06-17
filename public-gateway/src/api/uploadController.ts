import useAuthStore from "@/stores/auth";
import type { IUploadController } from "@/types/shared/fileUpload";
import { ref } from "vue";
import useHttpClient from "./httpClient";

interface IUploadResource {
  upload: (destination: string, file: File, uploadController: IUploadController) => Promise<any>;
}

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export function provideUploadController() {
  const httpClient = useHttpClient();
  const { state } = useAuthStore();

  async function upload(
    destination: string,
    file: File,
    uploadController: IUploadController,
  ): Promise<any> {
    const url = BASE_URL + "/" + destination + "/upload";
    const formData = new FormData();

    formData.append(file.name, file);
    formData.append("userId", state.userId);
    formData.append("userName", state.userName);

    const handler = httpClient.fileUploadRequest(url, formData);
    uploadController.cancel = handler.cancel;

    const response = await handler.caller();
    if (!response) {
      throw new Error("File upload failed");
    }
    return response;
  }

  const uploadResource = ref<IUploadResource>({
    upload,
  });

  return uploadResource;
}
