import { defineStore } from "pinia";
import useHttpClient from "./httpClient";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const useMediaServiceApi = defineStore("mediaServiceApi", () => {
  const BASE_MEDIA_URL = BASE_URL + "/media";
  const httpClient = useHttpClient();

  async function getMediaList(): Promise<any> {
    return await httpClient.httpGet(BASE_MEDIA_URL);
  }

  async function goToPlayer(): Promise<any> {
    return await httpClient.httpGet(BASE_MEDIA_URL + "/player");
  }

  return { getMediaList, goToPlayer };
});

export default useMediaServiceApi;
