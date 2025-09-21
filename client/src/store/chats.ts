import { create } from "zustand";
import {
  listMyChatsApi,
  getOrCreateChatApi,
  deleteChatApi,
  type Chat,
} from "../api/chats";
import { useAuthStore } from "./auth";
import { useContactsStore } from "./contacts";
import { usePeerStore } from "./peer";
import type { Contact } from "../api/contacts";

function sortChats(list: Chat[]) {
  const pick = (c: Chat) => c.lastMessageAt ?? c.updatedAt ?? c.createdAt ?? "";
  return [...list].sort((a, b) => (pick(b) > pick(a) ? 1 : pick(b) < pick(a) ? -1 : 0));
}

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

type ChatsState = {
  items: Chat[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;

  selectedId: number | null;

  otherUserId: (c: Chat) => number | null;
  otherUsername: (c: Chat) => string;

  displayNameFor: (c: Chat) => string;
  avatarFor: (c: Chat) => string;

  fetch: (force?: boolean) => Promise<void>;
  select: (id: number | null) => void;
  openWith: (otherUserId: number) => Promise<Chat>;
  remove: (id: number) => Promise<void>;
};

type ContactNameLike = Partial<Pick<Contact, "firstName" | "lastName" | "email" | "displayName">>;

function contactDisplayName(contact?: ContactNameLike): string | undefined {
  if (!contact) return;
  const alias = contact.displayName?.trim();
  if (alias) return alias;

  const fn = (contact.firstName ?? "").trim();
  const ln = (contact.lastName ?? "").trim();
  const full = [fn, ln].filter(Boolean).join(" ").trim();

  const email = (contact.email ?? "").trim();
  return full || (email || undefined);
}

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

  displayNameFor: (c) => {
    const uid = get().otherUserId(c);
    const fallback = get().otherUsername(c);

    // 1) Contact by userId (best)
    if (uid != null) {
      const byUser = useContactsStore.getState().byUserId[uid];
      const n1 = contactDisplayName(byUser);
      if (n1) return n1;
    }

    // 2) Contact by email (if peer exposes email)
    const peer = uid != null ? usePeerStore.getState().byId[uid] : undefined;
    const peerEmail = (peer?.email || "").trim().toLowerCase();
    if (peerEmail) {
      const byEmail = useContactsStore.getState().byEmail[peerEmail];
      const n2 = contactDisplayName(byEmail);
      if (n2) return n2;
    }

    // 3) Peer full name
    if (peer) {
      const full = `${peer.firstName ?? ""} ${peer.lastName ?? ""}`.trim();
      if (full) return full;
    }

    // 4) Fallback to username
    return fallback;
  },

  avatarFor: (c) => {
    const name = get().displayNameFor(c);
    const uid = get().otherUserId(c);

    // 1) Contact avatar by userId
    if (uid != null) {
      const byUser = useContactsStore.getState().byUserId[uid];
      if (byUser?.avatarUrl) return byUser.avatarUrl;
    }

    // 2) Contact avatar by email
    const peer = uid != null ? usePeerStore.getState().byId[uid] : undefined;
    const peerEmail = (peer?.email || "").trim().toLowerCase();
    if (peerEmail) {
      const byEmail = useContactsStore.getState().byEmail[peerEmail];
      if (byEmail?.avatarUrl) return byEmail.avatarUrl;
    }

    // 3) Peer profile picture
    if (peer?.profilePictureUrl) return peer.profilePictureUrl;

    // 4) Initials
    return initialsAvatar(name);
  },

  fetch: async (force = false) => {
    const { loading, hasLoaded } = get();
    if (!force && (loading || hasLoaded)) return;

    set({ loading: true, error: null });
    try {
      const data = await listMyChatsApi();
      set({ items: sortChats(data), loading: false, hasLoaded: true });

      // Preload peers so we have emails/profile pics for contact matching
      const otherIds = Array.from(
        new Set(
          data
            .map((c) => get().otherUserId(c) ?? null)
            .filter((v): v is number => v != null && v > 0)
        )
      );
      const ensure = usePeerStore.getState().ensure;
      otherIds.forEach((id) => ensure(id).catch(() => {})); // no-op on failure
    } catch (e: any) {
      set({
        loading: false,
        error: e?.response?.data?.message || e?.message || "Failed to load chats",
      });
      throw e;
    }
  },


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

      usePeerStore.getState().ensure(otherUserId).catch(() => {});
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
