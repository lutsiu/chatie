import { api } from "./client";

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string | null;
  profilePictureUrl: string | null;
  about: string | null;
};

export type LoginBody = { identifier: string; password: string };
export type RegisterBody = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

// users controller (register)
export const registerApi = async (body: RegisterBody) => {
  // returns UserDTO (no tokens). We'll auto-login right after.
  const { data } = await api.post<User>("/api/users", body);
  return data;
};

// auth controller (login)
export const loginApi = async (body: LoginBody) => {
  const { data } = await api.post<AuthResponse>("/auth/login", body);
  return data;
};

// auth controller (refresh)
export const refreshApi = async (refreshToken: string) => {
  const { data } = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
  return data;
};
