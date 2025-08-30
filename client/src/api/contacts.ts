import { api } from "./client";

export type Contact = {
  id: number;

  // Best key if your backend provides it:
  userId?: number | null;

  // Helpful fallbacks:
  username?: string | null;
  email?: string | null;

  // Names (any subset is fine; we’ll normalize in the store):
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null; // e.g. “Friend”, “Colleague”

  // Optional avatar/photo:
  avatarUrl?: string | null;
};

export type CreateContactBody = {
  email: string;
  firstName: string;
  lastName?: string;
};

export type UpdateContactBody = Partial<CreateContactBody> & {
  displayName?: string | null;
  avatarUrl?: string | null;
  username?: string | null;
  userId?: number | null;
};

export const listContactsApi = async (q?: string) => {
  const { data } = await api.get<Contact[]>("/api/contacts", {
    params: q ? { q } : {},
  });
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
