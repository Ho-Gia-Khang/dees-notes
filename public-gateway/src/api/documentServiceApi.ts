import useAuthStore from "@/stores/auth";
import { defineStore } from "pinia";
import useHttpClient from "./httpClient";
import type { ApiListResponse } from "@/types/shared/common";
import type { IFile } from "@/types/document/file";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const useDocumentServiceApi = defineStore("documentServiceApi", () => {
  const BASE_DOCUMENT_URL = BASE_URL + "/document";
  const httpClient = useHttpClient();
  const { state } = useAuthStore();

  async function getDocumentsList(): Promise<ApiListResponse<IFile>> {
    return await httpClient.httpGet(`${BASE_DOCUMENT_URL}/${state.userId}`);
  }

  async function deleteFile(fileId: string): Promise<void> {
    const url = `${BASE_DOCUMENT_URL}/${fileId}`;

    await httpClient.httpDelete(`${url}?userId=${state.userId}`);
  }

  async function downloadFile(fileId: string, fileName?: string): Promise<void> {
    const url = `${BASE_DOCUMENT_URL}/download/${fileId}?userId=${state.userId}`;
    await httpClient.httpDownload(url, fileName);
  }

  return { getDocumentsList, downloadFile, deleteFile };
});

export default useDocumentServiceApi;
