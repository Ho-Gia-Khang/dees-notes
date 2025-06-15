import { defineStore } from "pinia";
import useHttpClient from "./httpClient";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const useDocumentServiceApi = defineStore("documentServiceApi", () => {
  const BASE_DOCUMENT_URL = BASE_URL + "/document";
  const httpClient = useHttpClient();

  async function getDocumentsList(): Promise<any> {
    return await httpClient.httpGet(BASE_DOCUMENT_URL);
  }

  return { getDocumentsList };
});

export default useDocumentServiceApi;
