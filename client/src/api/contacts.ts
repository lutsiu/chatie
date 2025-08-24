import { api } from "./client";

export type Contact = {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
};

export type CreateContactBody = {
  email: string;
  firstName: string;
  lastName?: string;
};

export type UpdateContactBody = Partial<CreateContactBody>;

export const listContactsApi = async (q?: string) => {
  const { data } = await api.get<Contact[]>("/api/contacts", { params: q ? { q } : {} });
  console.log(data);
  return data;
};

export const createContactApi = async (body: CreateContactBody) => {
  const { data } = await api.post<Contact>("/api/contacts", body);
  return data;
};

export const updateContactApi = async (id: number, body: UpdateContactBody) => {
  const { data } = await api.patch<Contact>(`/api/contacts/${id}`, body);
  return data;
};

export const deleteContactApi = async (id: number) => {
  await api.delete(`/api/contacts/${id}`);
};
