import { create } from "zustand";
import {
  listMessagesApi,
  createMessageApi,
  editMessageApi,
  deleteMessageApi,
  listPinnedMessagesApi,
  pinMessageApi,
  unpinMessageApi,
  type Message,
  type MessageLocal,
  type CreateMessageBody,
} from "../api/messages";
import { useAuthStore } from "./auth";

/* Keep messages in ASC (oldest → newest) inside each chat bucket.
   Backend returns DESC; we reverse on insert to maintain ASC.  */

type ChatBucket = {
  items: MessageLocal[];   // ASC order
  loadingFirst: boolean;
  loadingMore: boolean;
  error: string | null;
  topReached: boolean;     // true when there are no older messages left
  initialized: boolean;    // first page fetched at least once
  /** For dedupe when realtime arrives. */
  seenIds: Set<number>;
};

type PinnedBucket = {
  items: Message[];
  loading: boolean;
  error: string | null;
};

type State = {
  byChat: Record<number, ChatBucket>;
  pinned: Record<number, PinnedBucket>;
  pageSize: number;

  /* queries */
  ensureFirstPage: (chatId: number, force?: boolean) => Promise<void>;
  loadMore: (chatId: number) => Promise<void>;

  /* mutations */
  sendText: (chatId: number, content: string, opts?: { replyToId?: number | null }) => Promise<Message | null>;
  send: (body: Omit<CreateMessageBody, "senderId">) => Promise<Message | null>;
  edit: (chatId: number, id: number, content: string) => Promise<Message | null>;
  remove: (chatId: number, id: number) => Promise<void>;

  /* pinned */
  fetchPinned: (chatId: number) => Promise<void>;
  pin: (chatId: number, messageId: number) => Promise<void>;
  unpin: (chatId: number, messageId: number) => Promise<void>;

  /* utility (useful when sockets arrive) */
  applyIncoming: (msg: Message) => void;
};

const ensureBucket = (s: State, chatId: number): ChatBucket => {
  if (!s.byChat[chatId]) {
    s.byChat[chatId] = {
      items: [],
      loadingFirst: false,
      loadingMore: false,
      error: null,
      topReached: false,
      initialized: false,
      seenIds: new Set<number>(),
    };
  }
  return s.byChat[chatId];
};

export const useMessagesStore = create<State>()((set, get) => ({
  byChat: {},
  pinned: {},
  pageSize: 30,

  ensureFirstPage: async (chatId, force = false) => {
    set((s) => {
      const b = ensureBucket(s, chatId);
      if (b.initialized && !force) return s;
      b.loadingFirst = true;
      b.error = null;
      return { ...s };
    });

    try {
      const data = await listMessagesApi(chatId, { limit: get().pageSize });
      // server returns DESC; convert to ASC
      const asc = [...data].reverse();
      set((s) => {
        const b = ensureBucket(s, chatId);
        b.items = [];
        b.seenIds.clear();
        asc.forEach((m) => {
          b.items.push(m);
          b.seenIds.add(m.id);
        });
        b.topReached = data.length < get().pageSize; // if fewer than requested, no more older
        b.loadingFirst = false;
        b.initialized = true;
        return { ...s };
      });
    } catch (e: any) {
      set((s) => {
        const b = ensureBucket(s, chatId);
        b.loadingFirst = false;
        b.error = e?.response?.data?.message || e?.message || "Failed to load messages";
        return { ...s };
      });
      throw e;
    }
  },

  loadMore: async (chatId) => {
    const b = get().byChat[chatId];
    if (!b || b.loadingMore || b.topReached) return;

    const oldestId = b.items[0]?.id;
    set((s) => {
      const bb = ensureBucket(s, chatId);
      bb.loadingMore = true;
      bb.error = null;
      return { ...s };
    });

    try {
      const data = await listMessagesApi(chatId, {
        limit: get().pageSize,
        beforeId: oldestId,
      });
      // data is DESC older->new, so reverse to ASC and prepend
      const asc = [...data].reverse();
      set((s) => {
        const bb = ensureBucket(s, chatId);
        asc.forEach((m) => {
          if (!bb.seenIds.has(m.id)) {
            bb.items.unshift(m);
            bb.seenIds.add(m.id);
          }
        });
        bb.topReached = data.length < get().pageSize;
        bb.loadingMore = false;
        return { ...s };
      });
    } catch (e: any) {
      set((s) => {
        const bb = ensureBucket(s, chatId);
        bb.loadingMore = false;
        bb.error = e?.response?.data?.message || e?.message || "Failed to load older messages";
        return { ...s };
      });
      throw e;
    }
  },

  sendText: async (chatId, content, opts) => {
    return get().send({
      chatId,
      type: "TEXT",
      content,
      replyToId: opts?.replyToId ?? null,
      attachments: [],
    });
  },

  send: async (body) => {
    const meId = useAuthStore.getState().user?.id;
    if (!meId) {
      console.warn("send(): no auth user");
      return null;
    }
    const chatId = body.chatId;

    // optimistic message
    const tempId = -Math.floor(Math.random() * 10_000_000) - 1; // negative temp id
    const nowIso = new Date().toISOString();
    const optimistic: MessageLocal = {
      id: tempId,
      chatId,
      senderId: meId,
      senderUsername: useAuthStore.getState().user?.username || "me",
      type: body.type,
      content: body.content ?? null,
      replyToId: body.replyToId ?? null,
      replyToPreview: null,
      createdAt: nowIso,
      editedAt: null,
      deletedAt: null,
      attachments:
        (body.attachments || []).map((a, i) => ({
          id: -i - 1,
          url: a.url,
          mime: a.mime ?? null,
          sizeBytes: a.sizeBytes ?? null,
          width: a.width ?? null,
          height: a.height ?? null,
          durationSec: a.durationSec ?? null,
          originalName: a.originalName ?? null,
          position: a.position ?? i,
        })),
      _localStatus: "sending",
    };

    set((s) => {
      const b = ensureBucket(s, chatId);
      b.items.push(optimistic);
      return { ...s };
    });

    try {
      const saved = await createMessageApi({ ...body, senderId: meId });
      set((s) => {
        const b = ensureBucket(s, chatId);
        const idx = b.items.findIndex((m) => m.id === tempId);
        if (idx >= 0) b.items[idx] = saved; // replace
        else b.items.push(saved);          // (fallback) append
        b.seenIds.add(saved.id);
        return { ...s };
      });
      return saved;
    } catch (e) {
      set((s) => {
        const b = ensureBucket(s, chatId);
        const idx = b.items.findIndex((m) => m.id === tempId);
        if (idx >= 0) b.items[idx]._localStatus = "error";
        return { ...s };
      });
      return null;
    }
  },

  edit: async (chatId, id, content) => {
    const saved = await editMessageApi(id, { content });
    set((s) => {
      const b = ensureBucket(s, chatId);
      const idx = b.items.findIndex((m) => m.id === id);
      if (idx >= 0) b.items[idx] = { ...b.items[idx], ...saved };
      return { ...s };
    });
    return saved;
  },

  remove: async (chatId, id) => {
    await deleteMessageApi(id);
    set((s) => {
      const b = ensureBucket(s, chatId);
      const idx = b.items.findIndex((m) => m.id === id);
      if (idx >= 0) {
        b.items[idx] = { ...b.items[idx], deletedAt: new Date().toISOString() };
      }
      return { ...s };
    });
  },

  /* ----- pinned ----- */

  fetchPinned: async (chatId) => {
    set((s) => ({
      ...s,
      pinned: {
        ...s.pinned,
        [chatId]: { items: [], loading: true, error: null },
      },
    }));
    try {
      const data = await listPinnedMessagesApi(chatId);
      set((s) => ({
        ...s,
        pinned: {
          ...s.pinned,
          [chatId]: { items: data, loading: false, error: null },
        },
      }));
    } catch (e: any) {
      set((s) => ({
        ...s,
        pinned: {
          ...s.pinned,
          [chatId]: {
            items: [],
            loading: false,
            error: e?.response?.data?.message || e?.message || "Failed to load pinned",
          },
        },
      }));
    }
  },

  pin: async (chatId, messageId) => {
    const meId = requireAuthId();
    await pinMessageApi(chatId, messageId, meId);
    await get().fetchPinned(chatId);
  },

  unpin: async (chatId, messageId) => {
    await unpinMessageApi(chatId, messageId);
    await get().fetchPinned(chatId);
  },

  /* ----- incoming (for future sockets/SSE) ----- */

  applyIncoming: (msg: Message) => {
    const chatId = msg.chatId;
    set((s) => {
      const b = ensureBucket(s, chatId);
      if (!b.seenIds.has(msg.id)) {
        b.items.push(msg);
        b.seenIds.add(msg.id);
      } else {
        const idx = b.items.findIndex((m) => m.id === msg.id);
        if (idx >= 0) b.items[idx] = msg;
      }
      return { ...s };
    });
  },
}));

const requireAuthId = (): number => {
  const u = useAuthStore.getState().user;
  if (!u) throw new Error("Not authenticated");
  return u.id;
};