import { defineStore } from "pinia";
import { ref } from "vue";

const useHttpClient = defineStore("httpClient", () => {
  const _token = ref("");

  function createHeaders() {
    const headers: { [key: string]: string } = {
      // Authorization: `Bearer ${_token.value}`,
    };

    return headers;
  }

  function setToken(token: string) {
    _token.value = token;
  }

  async function httpRequest(url: string, method: string, body?: any) {
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
