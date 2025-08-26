import { create } from "zustand";
import {
  listMyChatsApi,
  getOrCreateChatApi,
  deleteChatApi,
  type Chat,
} from "../api/chats";
import { useAuthStore } from "./auth";

function sortChats(list: Chat[]) {
  const pick = (c: Chat) => c.lastMessageAt ?? c.updatedAt ?? c.createdAt ?? "";
  return [...list].sort((a, b) => (pick(b) > pick(a) ? 1 : pick(b) < pick(a) ? -1 : 0));
}

type ChatsState = {
  items: Chat[];
  loading: boolean;
  error: string | null;

  /** prevents repeated fetch loops */
  hasLoaded: boolean;

  selectedId: number | null;

  // helpers (pure)
  otherUserId: (c: Chat) => number | null;
  otherUsername: (c: Chat) => string;

  // actions
  fetch: (force?: boolean) => Promise<void>;
  select: (id: number | null) => void;
  openWith: (otherUserId: number) => Promise<Chat>;
  remove: (id: number) => Promise<void>;
};

export const useChatsStore = create<ChatsState>()((set, get) => ({
  items: [],
  loading: false,
  error: null,
  hasLoaded: false,

  selectedId: null,

  otherUserId: (c) => {
    const me = useAuthStore.getState().user;
    if (!me) return null;
    return c.user1Id === me.id ? c.user2Id : c.user1Id;
  },
  otherUsername: (c) => {
    const me = useAuthStore.getState().user;
    if (!me) return "";
    return c.user1Id === me.id ? c.user2Username : c.user1Username;
  },

  /** guarded fetch (only once unless force=true) */
  fetch: async (force = false) => {
    const { loading, hasLoaded } = get();
    if (!force && (loading || hasLoaded)) return;

    set({ loading: true, error: null });
    try {
      const data = await listMyChatsApi();
      set({ items: sortChats(data), loading: false, hasLoaded: true });
    } catch (e: any) {
      set({
        loading: false,
        error: e?.response?.data?.message || e?.message || "Failed to load chats",
      });
      throw e;
    }
  },

  /** idempotent select (no set if same) */
  select: (id) => set((s) => (s.selectedId === id ? s : { selectedId: id })),

  openWith: async (otherUserId: number) => {
    set({ error: null });
    try {
      const chat = await getOrCreateChatApi(otherUserId);
      const next = sortChats([...get().items.filter((c) => c.id !== chat.id), chat]);
      set((s) => ({
        items: next,
        selectedId: s.selectedId === chat.id ? s.selectedId : chat.id,
        hasLoaded: true,
      }));
      return chat;
    } catch (e: any) {
      set({
        error: e?.response?.data?.message || e?.message || "Failed to open chat",
      });
      throw e;
    }
  },

  remove: async (id: number) => {
    set({ error: null });
    try {
      await deleteChatApi(id);
      set((s) => ({
        items: s.items.filter((c) => c.id !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
      }));
    } catch (e: any) {
      set({
        error: e?.response?.data?.message || e?.message || "Failed to delete chat",
      });
      throw e;
    }
  },
}));

/* ---------- simple selectors (no custom equality to avoid TS/version issues) ---------- */

export function useSelectedChatId(): number | null {
  return useChatsStore((s) => s.selectedId);
}

export function useSelectedChat(): Chat | null {
  return useChatsStore((s) => s.items.find((c) => c.id === s.selectedId) ?? null);
}

export function useSelectedPeerId(): number | null {
  return useChatsStore((s) => {
    if (!s.selectedId) return null;
    const chat = s.items.find((c) => c.id === s.selectedId);
    if (!chat) return null;
    const meId = useAuthStore.getState().user?.id;
    if (!meId) return null;
    return chat.user1Id === meId ? chat.user2Id : chat.user1Id;
  });
}

export function useSelectedPeerUsername(): string | null {
  return useChatsStore((s) => {
    if (!s.selectedId) return null;
    const chat = s.items.find((c) => c.id === s.selectedId);
    if (!chat) return null;
    const meId = useAuthStore.getState().user?.id;
    if (!meId) return null;
    return chat.user1Id === meId ? chat.user2Username : chat.user1Username;
  });
}

export function useSelectedPeer(): { id: number; username: string } | null {
  return useChatsStore((s) => {
    if (!s.selectedId) return null;
    const chat = s.items.find((c) => c.id === s.selectedId);
    if (!chat) return null;
    const meId = useAuthStore.getState().user?.id;
    if (!meId) return null;
    return chat.user1Id === meId
      ? { id: chat.user2Id, username: chat.user2Username }
      : { id: chat.user1Id, username: chat.user1Username };
  });
}
