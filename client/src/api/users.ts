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

export type RegisterBody = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
};

export type UpdateMeBody = Partial<{
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string | null;
  about: string | null;
}>;

export const registerApi = async (body: RegisterBody) => {
  const { data } = await api.post<User>("/api/users", body);
  return data;
};

export const getMeApi = async () => {
  const { data } = await api.get<User>("/api/users/me");
  return data;
};

export const updateMeApi = async (body: UpdateMeBody) => {
  const { data } = await api.patch<User>("/api/users/me", body);
  return data;
};

export const uploadMyAvatarApi = async (file: File) => {
  const fd = new FormData();
  fd.append("file", file); // must be "file"
  const { data } = await api.post<User>("/api/users/me/avatar", fd);
  return data;
};
