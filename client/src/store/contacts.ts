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

function keyU(v?: number | null) {
  return v == null ? null : Number(v);
}

function keyS(v?: string | null) {
  return v?.trim().toLowerCase() || null;
}

function indexContacts(list: Contact[]) {
  const byUserId: Record<number, Contact> = {};
  const byUsername: Record<string, Contact> = {};
  const byEmail: Record<string, Contact> = {};

  for (const c of list) {
    const u = keyU(c.userId);
    const un = keyS(c.username);
    const em = keyS(c.email);

    if (u != null) byUserId[u] = c;
    if (un) byUsername[un] = c;
    if (em) byEmail[em] = c;
  }
  return { byUserId, byUsername, byEmail };
}

type ContactsState = {
  items: Contact[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  hasLoaded: boolean;

  byUserId: Record<number, Contact>;
  byUsername: Record<string, Contact>;
  byEmail: Record<string, Contact>;

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
  hasLoaded: false,

  byUserId: {},
  byUsername: {},
  byEmail: {},

  async fetch(q) {
    set({ loading: true, error: null });
    try {
      const data = await listContactsApi(q);
      const idx = indexContacts(data);
      set({
        items: data,
        ...idx,
        hasLoaded: true,
      });
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
      const next = [created, ...get().items];
      const idx = indexContacts(next);
      set({ items: next, ...idx });
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
      const next = get().items.map((c) => (c.id === id ? updated : c));
      const idx = indexContacts(next);
      set({ items: next, ...idx });
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
      const next = get().items.filter((c) => c.id !== id);
      const idx = indexContacts(next);
      set({ items: next, ...idx });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Failed to delete contact" });
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  clear() {
    set({
      items: [],
      error: null,
      loading: false,
      saving: false,
      hasLoaded: false,
      byUserId: {},
      byUsername: {},
      byEmail: {},
    });
  },
}));
