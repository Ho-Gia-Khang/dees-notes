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
      if (response.status === EHttpStatusCode.UNAUTHORIZED) {
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

  function fileUploadRequest(url: string, formData: FormData) {
    const headers = createHeaders();

    const controller = new AbortController();
    const signal = controller.signal;

    const caller = async () => {
      return new Promise<any>((resolve, reject) => {
        fetch(url, {
          method: "post",
          headers,
          body: formData,
          signal,
        }).then((response) => {
          if (!response.ok) {
            if (response.status === EHttpStatusCode.UNAUTHORIZED) {
              auth.logout();
            }
            reject(new Error(`HTTP error! status: ${response.status}`));
          }

          response.json().then((data) => resolve(data));
        });
      });
    };

    const cancel = async () => {
      controller.abort();
    };
    return {
      caller,
      cancel,
    };
  }

  return {
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    fileUploadRequest,
    setToken,
  };
});

export default useHttpClient;
