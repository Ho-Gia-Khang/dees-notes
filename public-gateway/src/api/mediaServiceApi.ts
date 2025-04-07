import { defineStore } from "pinia";
import useHttpClient from "./httpClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useMediaServiceApi = defineStore("mediaServiceApi", () => {
  const BASE_MEDIA_URL = BASE_URL + "/media";
  const httpClient = useHttpClient();

  async function getMediaList(): Promise<any> {
    return await httpClient.httpGet(BASE_MEDIA_URL);
  }

  return { getMediaList };
});

export default useMediaServiceApi;
