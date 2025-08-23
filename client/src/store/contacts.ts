import { create } from "zustand";
import { listContactsApi, createContactApi, deleteContactApi, updateContactApi, type Contact, type CreateContactBody, type UpdateContactBody } from "../api/contacts";

type ContactsState = {
  items: Contact[];
  loading: boolean;
  saving: boolean;
  error: string | null;

  fetch: (q?: string) => Promise<void>;
  add: (body: CreateContactBody) => Promise<Contact>;
  update: (id: number, body: UpdateContactBody) => Promise<Contact>;
  remove: (id: number) => Promise<void>;
};

export const useContactsStore = create<ContactsState>()((set, get) => ({
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
      const c = await createContactApi(body);
      set({ items: [c, ...get().items] });
      return c;
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to add contact" });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  async update(id, body) {
    set({ saving: true, error: null });
    try {
      const c = await updateContactApi(id, body);
      set({ items: get().items.map((x) => (x.id === id ? c : x)) });
      return c;
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
      set({ items: get().items.filter((x) => x.id !== id) });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to remove contact" });
      throw e;
    } finally {
      set({ saving: false });
    }
  },
}));
