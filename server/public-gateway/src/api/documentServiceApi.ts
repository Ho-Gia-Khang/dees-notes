import useAuthStore from "@/stores/auth";
import { defineStore } from "pinia";
import useHttpClient from "./httpClient";
import type { ApiListRequest, ApiListResponse } from "@/types/shared/common";
import type { IFile } from "@/types/document/file";
import { buildSearchParams } from "@/utils";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const useDocumentServiceApi = defineStore("documentServiceApi", () => {
  const BASE_DOCUMENT_URL = BASE_URL + "/document";
  const httpClient = useHttpClient();
  const { state } = useAuthStore();

  async function getDocumentsList(
    folderId: string,
    query: ApiListRequest,
  ): Promise<ApiListResponse<IFile>> {
    const params = buildSearchParams(query);
    if (params) {
      params.set("folderId", folderId);
    }
    return await httpClient.httpGet(`${BASE_DOCUMENT_URL}/${state.userId}?${params?.toString()}`);
  }

  async function deleteFile(fileId: string): Promise<void> {
    const url = `${BASE_DOCUMENT_URL}/delete/${fileId}`;
    await httpClient.httpDelete(`${url}?userId=${state.userId}`);
  }

  async function downloadFile(fileId: string, fileName?: string): Promise<void> {
    const url = `${BASE_DOCUMENT_URL}/download/${fileId}?userId=${state.userId}`;
    await httpClient.httpDownload(url, fileName);
  }

  return { getDocumentsList, downloadFile, deleteFile };
});

export default useDocumentServiceApi;
