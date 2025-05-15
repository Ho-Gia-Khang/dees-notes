import useAuthStore from "@/stores/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";
export enum EHttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const useHttpClient = defineStore("httpClient", () => {
  const _token = ref("");
  const auth = useAuthStore();

  function createHeaders() {
    const headers: { [key: string]: string } = {};
    if (_token.value) {
      headers["Authorization"] = `Bearer ${_token.value}`;
    }

    return headers;
  }

  function setToken(token: string) {
    _token.value = token;
  }

  async function httpRequest(url: string, method: HttpMethods, body?: any) {
    const headers = createHeaders();
    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === EHttpStatusCode.FORBIDDEN) {
        auth.logout();
      }
      throw await response.json();
    }

    return await response.json();
  }

  async function httpGet(url: string) {
    return await httpRequest(url, "GET");
  }
  async function httpPost(url: string, body: any) {
    return await httpRequest(url, "POST", body);
  }
  async function httpPut(url: string, body: any) {
    return await httpRequest(url, "PUT", body);
  }
  async function httpDelete(url: string) {
    return await httpRequest(url, "DELETE");
  }

  return {
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    setToken,
  };
});

export default useHttpClient;
