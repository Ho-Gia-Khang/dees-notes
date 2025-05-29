import useHttpClient from "@/api/httpClient";
import { defineStore } from "pinia";
import { computed, nextTick, onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { delayMs, setLocalStorage } from "@/utils";
import { ERoles, LOCAL_STORAGE_KEYS, LOGIN_ROUTE } from "@/constants";
import { useRouter } from "vue-router";
import useUserApi from "@/api/userApi";

const RENEW_TOKEN_INTERVAL = 600; // in seconds
const LOGIN_SILENT_INTERVAL = (RENEW_TOKEN_INTERVAL / 2) * 1000; // in milliseconds

const useAuthStore = defineStore("authStore", () => {
  const httpClient = useHttpClient();
  const router = useRouter();
  const userApi = useUserApi();

  const role = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const session = ref<{ [key: string]: any }>({});

  const isAdmin = computed(() => role.value === ERoles.ADMIN);

  let intervalId: number = 0;

  async function login(phoneNumber: string, password: string) {
    try {
      const response = await userApi.login(phoneNumber, password);
      if (response) {
        session.value = response;
        setLocalStorage(LOCAL_STORAGE_KEYS.SESSION_INFO, response);
      }
    } catch (error) {
      console.error("Login failed:", error);
      clearSession();
      throw error;
    }
  }

  async function startUp() {
    // check if the user is already logged in
    const storedSession = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_INFO);

    // if not logged in, redirect to login page
    if (!storedSession) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    const refreshToken = JSON.parse(storedSession).refreshToken;
    if (!refreshToken) {
      console.error("No refresh token found in session.");
      clearSession();
      router.replace(LOGIN_ROUTE);
      return;
    }

    const decodedRefreshToken = jwtDecode(refreshToken);
    if (!decodedRefreshToken.exp || decodedRefreshToken.exp * 1000 < Date.now()) {
      try {
        const response = await userApi.loginSilent(refreshToken);
        session.value = response;
        await nextTick();

        tryExtractToken();
        setLocalStorage(LOCAL_STORAGE_KEYS.SESSION_INFO, response);
      } catch (error) {
        console.error("Token refresh failed:", error);
        clearSession();
        router.replace(LOGIN_ROUTE);
      }
    } else {
      session.value = JSON.parse(storedSession);
      await nextTick();
      tryExtractToken();
    }
  }

  function tryExtractToken() {
    const token = session.value.accessToken;
    if (token) {
      httpClient.setToken(token);
      const decodedToken = jwtDecode(token) as any;
      role.value = decodedToken.role;
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  }

  async function renewTokenSilent() {
    if (!isAuthenticated.value) return;

    try {
      const currentRefreshToken = session.value.refreshToken;
      if (!currentRefreshToken) {
        // make request return 401 if refresh token is not found
        httpClient.setToken("");
        return;
      }

      const response = await userApi.loginSilent(currentRefreshToken);

      session.value = response;

      await nextTick();
      tryExtractToken();
      setLocalStorage(LOCAL_STORAGE_KEYS.SESSION_INFO, response);
    } catch (error) {
      console.error("Token renewal failed:", error);
      clearSession();
      throw error;
    }
  }

  async function logout() {
    try {
      await userApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      clearSession();
      router.replace(LOGIN_ROUTE);
    }
  }

  async function deleteAccount() {
    try {
      await userApi.deleteAccount();
      clearSession();
      router.replace(LOGIN_ROUTE);
    } catch (error) {
      console.error("Account deletion failed:", error);
      throw error;
    }
  }

  function clearSession() {
    session.value = {};
    role.value = null;
    isAuthenticated.value = false;
    localStorage.clear();
    sessionStorage.clear();
    clearInterval(intervalId);
  }

  onMounted(async () => {
    await startUp();
    await delayMs(500);

    if (isAuthenticated.value) {
      intervalId = setInterval(async () => {
        const accessToken = jwtDecode(session.value.accessToken);

        if (!accessToken.exp || accessToken.exp * 1000 < RENEW_TOKEN_INTERVAL) {
          await renewTokenSilent();
        }
      }, LOGIN_SILENT_INTERVAL);
    }
  });

  return {
    state: {
      isAuthenticated,
      role,
      isAdmin,
    },
    login,
    logout,
    clearSession,
    deleteAccount,
  };
});

export default useAuthStore;
