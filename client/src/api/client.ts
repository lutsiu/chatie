import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth";

export const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

// attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 refresh queue
let isRefreshing = false;
let pending: Array<(token: string | null) => void> = [];
const subscribe = (cb: (t: string | null) => void) => pending.push(cb);
const publish = (t: string | null) => { pending.forEach((cb) => cb(t)); pending = []; };

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const { refreshToken, refreshTokens, logout } = useAuthStore.getState();

    if (!error.response || error.response.status !== 401) return Promise.reject(error);
    if (!refreshToken) { logout(); return Promise.reject(error); }

    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (original._retry) { logout(); return Promise.reject(error); }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newAccess = await refreshTokens(); // string | null
        isRefreshing = false;
        publish(newAccess ?? null);
      } catch (e) {
        isRefreshing = false;
        publish(null);
        logout();
        return Promise.reject(e);
      }
    }

    return new Promise((resolve, reject) => {
      subscribe((newToken) => {
        if (!newToken) return reject(error);
        original._retry = true;
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        resolve(api(original));
      });
    });
  }
);
