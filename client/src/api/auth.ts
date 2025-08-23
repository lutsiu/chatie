import { api } from "./client";
import type { User } from "./users";

export type LoginBody = { identifier: string; password: string };
export type AuthResponse = { accessToken: string; refreshToken: string; user: User };

export const loginApi = async (body: LoginBody) => {
  const { data } = await api.post<AuthResponse>("/auth/login", body);
  return data;
};

export const refreshApi = async (refreshToken: string) => {
  const { data } = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
  return data;
};
