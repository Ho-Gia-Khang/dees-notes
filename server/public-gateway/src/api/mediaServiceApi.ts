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

  async function getMediaList(query: ApiListRequest): Promise<any> {
    const params = buildSearchParams(query);
    return await httpClient.httpGet(`${BASE_MEDIA_URL}/${state.userId}?${params?.toString()}`);
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

  return { getMediaList, goToPlayer, deleteFile, downloadFile };
});

export default useMediaServiceApi;
