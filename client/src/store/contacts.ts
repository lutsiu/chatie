// src/store/contacts.ts
import { create } from "zustand";
import {
  listContactsApi,
  createContactApi,
  updateContactApi,
  deleteContactApi,
  type Contact,
  type CreateContactBody,
  type UpdateContactBody,
} from "../api/contacts";

type ContactsState = {
  items: Contact[];
  loading: boolean;
  saving: boolean;
  error: string | null;

  fetch: (q?: string) => Promise<void>;
  add: (body: CreateContactBody) => Promise<Contact>;
  patch: (id: number, body: UpdateContactBody) => Promise<Contact>;
  remove: (id: number) => Promise<void>;
  clear: () => void;
};

export const useContactsStore = create<ContactsState>((set, get) => ({
  items: [],
  loading: false,
  saving: false,
  error: null,

  async fetch(q) {
    set({ loading: true, error: null });
    try {
      const data = await listContactsApi(q);
      set({ items: data });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to load contacts" });
    } finally {
      set({ loading: false });
    }
  },

  async add(body) {
    set({ saving: true, error: null });
    try {
      const created = await createContactApi(body);
      set({ items: [created, ...get().items] });
      return created;
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to add contact" });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  async patch(id, body) {
    set({ saving: true, error: null });
    try {
      const updated = await updateContactApi(id, body);
      set({ items: get().items.map((c) => (c.id === id ? updated : c)) });
      return updated;
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to update contact" });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  async remove(id) {
    set({ saving: true, error: null });
    try {
      await deleteContactApi(id);
      set({ items: get().items.filter((c) => c.id !== id) });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to delete contact" });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  clear() {
    set({ items: [], error: null, loading: false, saving: false });
  },
}));
