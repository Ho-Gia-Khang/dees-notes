import { defineStore } from "pinia";
import useHttpClient from "./httpClient";
import type { IUser } from "@/types/auth/User";
import type { ApiListResponse } from "@/types/shared/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useUserApi = defineStore("userApi", () => {
  const BASE_USER_URL = BASE_URL + "/auth";
  const httpClient = useHttpClient();

  return {
    login: async (phoneNumber: string, password: string): Promise<any> => {
      return await httpClient.httpPost(`${BASE_USER_URL}/login`, {
        phoneNumber,
        password,
      });
    },
    loginSilent: async (refreshToken: string): Promise<any> => {
      return await httpClient.httpPost(`${BASE_USER_URL}/loginSilent`, {
        refreshToken,
      });
    },
    logout: async (): Promise<any> => {
      return await httpClient.httpDelete(`${BASE_USER_URL}/logout`);
    },
    getUsersList: async (): Promise<ApiListResponse<IUser>> => {
      return await httpClient.httpGet(`${BASE_USER_URL}/usersList`);
    },
    getProfile: async (): Promise<IUser> => {
      return await httpClient.httpGet(`${BASE_USER_URL}/current`);
    },
    deleteAccount: async () => {
      return await httpClient.httpDelete(`${BASE_USER_URL}/deleteCurrent`);
    },
    deleteMemberAccount: async (phoneNumber: string): Promise<any> => {
      return await httpClient.httpDelete(`${BASE_USER_URL}/delete/${phoneNumber}`);
    },
    create: async (phoneNumber: string, password: string): Promise<any> => {
      return await httpClient.httpPost(`${BASE_USER_URL}/create`, {
        phoneNumber,
        password,
      });
    },
    update: async (phoneNumber?: string, password?: string): Promise<void> => {
      return await httpClient.httpPut(`${BASE_USER_URL}/update`, {
        phoneNumber,
        password,
      });
    },
  };
});

export default useUserApi;
