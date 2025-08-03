import { defineStore } from "pinia";
import useHttpClient from "./httpClient";
import useAuthStore from "@/stores/auth";
import type { ApiListRequest } from "@/types/shared/common";
import { buildSearchParams } from "@/utils";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const useMediaServiceApi = defineStore("mediaServiceApi", () => {
  const BASE_MEDIA_URL = BASE_URL + "/media";
  const httpClient = useHttpClient();
  const { state } = useAuthStore();

  async function getFoldersList(query: ApiListRequest) {
    const params = buildSearchParams(query);
    return await httpClient.httpGet(
      `${BASE_MEDIA_URL}/folders/${state.userId}?${params?.toString()}`,
    );
  }

  async function getMediaList(folderId: string, query: ApiListRequest): Promise<any> {
    const params = buildSearchParams(query);
    if (params) {
      params.set("userId", state.userId);
    }
    return await httpClient.httpGet(`${BASE_MEDIA_URL}/files/${folderId}?${params?.toString()}`);
  }

  async function goToPlayer(): Promise<any> {
    return await httpClient.httpGet(BASE_MEDIA_URL + "/player");
  }

  async function deleteFile(fileId: string): Promise<void> {
    const url = `${BASE_MEDIA_URL}/delete/${fileId}?userId=${state.userId}`;
    return await httpClient.httpDelete(url);
  }

  async function downloadFile(fileId: string, fileName?: string): Promise<void> {
    const url = `${BASE_MEDIA_URL}/download/${fileId}?userId=${state.userId}`;
    await httpClient.httpDownload(url, fileName);
  }

  async function deleteFolder(folderId: string): Promise<void> {
    const url = `${BASE_MEDIA_URL}/folders/delete/${folderId}?userId=${state.userId}`;
    return await httpClient.httpDelete(url);
  }

  return { getMediaList, goToPlayer, deleteFile, downloadFile, getFoldersList, deleteFolder };
});

export default useMediaServiceApi;
