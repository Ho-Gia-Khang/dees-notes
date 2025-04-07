import { defineStore } from "pinia";
import useHttpClient from "./httpClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useDashboardApi = defineStore("dashboardApi", () => {
  const httpClient = useHttpClient();

  async function getDashboard(): Promise<any> {
    return await httpClient.httpGet(BASE_URL);
  }

  return { getDashboard };
});

export default useDashboardApi;
