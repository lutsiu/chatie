import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

// ---- Attach access token on each request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Handle 401s with a refresh queue
let isRefreshing = false;
let pending: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (t: string | null) => void) {
  pending.push(cb);
}
function onRefreshed(token: string | null) {
  pending.forEach((cb) => cb(token));
  pending = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { refreshToken, refreshTokens, logout } = useAuthStore.getState();

    // If no response or not 401, just bubble up
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // If we have no refresh token, log out
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (original._retry) {
      // We've already retried once; bail
      logout();
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newAccess = await refreshTokens();
        isRefreshing = false;
        onRefreshed(newAccess);
      } catch (e) {
        isRefreshing = false;
        onRefreshed(null);
        logout();
        return Promise.reject(e);
      }
    }

    // Queue up this request until refresh finishes
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((newToken) => {
        if (!newToken) {
          reject(error);
          return;
        }
        original._retry = true;
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        resolve(api(original));
      });
    });
  }
);
