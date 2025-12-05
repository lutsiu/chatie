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

type ChatBucket = {
  items: MessageLocal[];   // ASC order
  loadingFirst: boolean;
  loadingMore: boolean;
  error: string | null;
  topReached: boolean;     // true when there are no older messages left
  initialized: boolean;    // first page fetched at least once

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

  /* utility (sockets) */
  applyIncoming: (msg: Message) => void;
};

/** Pure helper that never mutates existing state objects. */
const ensureBucketSafe = (
  byChat: State["byChat"],
  chatId: number
): [ChatBucket, State["byChat"]] => {
  const existing = byChat[chatId];
  if (existing) return [existing, byChat];
  const bucket: ChatBucket = {
    items: [],
    loadingFirst: false,
    loadingMore: false,
    error: null,
    topReached: false,
    initialized: false,
    seenIds: new Set<number>(),
  };
  return [bucket, { ...byChat, [chatId]: bucket }];
};

export const useMessagesStore = create<State>()((set, get) => ({
  byChat: {},
  pinned: {},
  pageSize: 30,

  ensureFirstPage: async (chatId, force = false) => {
    // mark loading (immutably)
    set((s) => {
      const [b, newByChat] = ensureBucketSafe(s.byChat, chatId);
      if (b.initialized && !force) return s;
      const updatedBucket: ChatBucket = { ...b, loadingFirst: true, error: null };
      return {
        ...s,
        byChat: { ...newByChat, [chatId]: updatedBucket },
      };
    });

    try {
      const data = await listMessagesApi(chatId, { limit: get().pageSize });
      const asc = [...data].reverse(); // convert to ASC

      set((s) => {
        const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);
        const nextSeen = new Set<number>();
        asc.forEach((m) => nextSeen.add(m.id));

        const updated: ChatBucket = {
          ...b,
          items: asc,                       // NEW ARRAY
          seenIds: nextSeen,                // NEW SET
          topReached: data.length < get().pageSize,
          loadingFirst: false,
          initialized: true,
          error: null,
        };

        return { ...s, byChat: { ...byChat2, [chatId]: updated } };
      });
    } catch (e: any) {
      set((s) => {
        const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);
        const updated: ChatBucket = { ...b, loadingFirst: false, error: e?.response?.data?.message || e?.message || "Failed to load messages" };
        return { ...s, byChat: { ...byChat2, [chatId]: updated } };
      });
      throw e;
    }
  },

  loadMore: async (chatId) => {
    const b = get().byChat[chatId];
    if (!b || b.loadingMore || b.topReached) return;

    const oldestId = b.items[0]?.id;

    // set loadingMore immutably
    set((s) => {
      const [bucket, byChat2] = ensureBucketSafe(s.byChat, chatId);
      const updated: ChatBucket = { ...bucket, loadingMore: true, error: null };
      return { ...s, byChat: { ...byChat2, [chatId]: updated } };
    });

    try {
      const data = await listMessagesApi(chatId, {
        limit: get().pageSize,
        beforeId: oldestId,
      });
      const asc = [...data].reverse(); 

      set((s) => {
        const [bucket, byChat2] = ensureBucketSafe(s.byChat, chatId);
        const seen = new Set(bucket.seenIds);
        const toPrepend: MessageLocal[] = [];
        for (const m of asc) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            toPrepend.push(m);
          }
        }
        const nextItems = toPrepend.length ? [...toPrepend, ...bucket.items] : bucket.items;
        const updated: ChatBucket = {
          ...bucket,
          items: nextItems === bucket.items ? [...bucket.items] : nextItems, 
          seenIds: seen,
          topReached: data.length < get().pageSize,
          loadingMore: false,
        };
        return { ...s, byChat: { ...byChat2, [chatId]: updated } };
      });
    } catch (e: any) {
      set((s) => {
        const [bucket, byChat2] = ensureBucketSafe(s.byChat, chatId);
        const updated: ChatBucket = {
          ...bucket,
          loadingMore: false,
          error: e?.response?.data?.message || e?.message || "Failed to load older messages",
        };
        return { ...s, byChat: { ...byChat2, [chatId]: updated } };
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

  // optimistic message (negative temp id)
  const tempId = -Math.floor(Math.random() * 10_000_000) - 1;
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

  // append optimistic (new array)
  set((s) => {
    const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);
    const nextItems = [...b.items, optimistic];
    const updated: ChatBucket = { ...b, items: nextItems };
    return { ...s, byChat: { ...byChat2, [chatId]: updated } };
  });

  try {
    const saved = await createMessageApi({ ...body, senderId: meId });

    set((s) => {
      const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);

      const tempIdx   = b.items.findIndex((m) => m.id === tempId);
      const savedIdx  = b.items.findIndex((m) => m.id === saved.id);

      let nextItems = b.items;

      if (savedIdx !== -1 && tempIdx !== -1) {
        // WS already inserted saved; remove optimistic
        nextItems = [
          ...b.items.slice(0, tempIdx),
          ...b.items.slice(tempIdx + 1),
        ];
      } else if (tempIdx !== -1) {
        // Replace optimistic with saved
        nextItems = [...b.items];
        nextItems[tempIdx] = saved;
      } else if (savedIdx === -1) {
        // Neither exists (e.g., no optimistic or it was already removed)
        nextItems = [...b.items, saved];
      } else {
        // saved already present, nothing to do
        nextItems = [...b.items];
      }

      const nextSeen = new Set(b.seenIds);
      nextSeen.add(saved.id);

      const updated: ChatBucket = { ...b, items: nextItems, seenIds: nextSeen };
      return { ...s, byChat: { ...byChat2, [chatId]: updated } };
    });

    return saved;
  } catch (e) {
    // mark optimistic as error (new array)
    set((s) => {
      const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);
      const idx = b.items.findIndex((m) => m.id === tempId);
      let nextItems = b.items;
      if (idx >= 0) {
        nextItems = [...b.items];
        nextItems[idx] = { ...nextItems[idx], _localStatus: "error" };
      }
      const updated: ChatBucket = { ...b, items: nextItems };
      return { ...s, byChat: { ...byChat2, [chatId]: updated } };
    });
    return null;
  }
},

  edit: async (chatId, id, content) => {
    const saved = await editMessageApi(id, { content });
    set((s) => {
      const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);
      const nextItems = b.items.map((m) => (m.id === id ? { ...(m as Message), ...saved } : m));
      const updated: ChatBucket = { ...b, items: nextItems };
      return { ...s, byChat: { ...byChat2, [chatId]: updated } };
    });
    return saved;
  },

  remove: async (chatId, id) => {
    await deleteMessageApi(id);
    set((s) => {
      const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);
      const nowIso = new Date().toISOString();
      const nextItems = b.items.map((m) => (m.id === id ? { ...m, deletedAt: nowIso } : m));
      const updated: ChatBucket = { ...b, items: nextItems };
      return { ...s, byChat: { ...byChat2, [chatId]: updated } };
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

  /* ----- incoming via sockets ----- */

  applyIncoming: (msg: Message) => {
  const chatId = msg.chatId;
  set((s) => {
    const [b, byChat2] = ensureBucketSafe(s.byChat, chatId);
    const seen = new Set(b.seenIds);

    const savedIdx = b.items.findIndex((m) => m.id === msg.id);

    // Try to match an optimistic message to replace:
    const tempIdx = b.items.findIndex(
      (m) =>
        (m as any)._localStatus === "sending" &&
        m.senderId === msg.senderId &&
        m.type === msg.type &&
        (m.content ?? "") === (msg.content ?? "") &&
        (m.replyToId ?? null) === (msg.replyToId ?? null) &&
        (m.attachments?.length ?? 0) === (msg.attachments?.length ?? 0)
    );

    let nextItems: MessageLocal[];

    if (savedIdx !== -1) {
      // Update existing saved
      nextItems = [...b.items];
      nextItems[savedIdx] = { ...(nextItems[savedIdx] as Message), ...msg };
    } else if (tempIdx !== -1) {
      // Replace optimistic with saved
      nextItems = [...b.items];
      nextItems[tempIdx] = msg;
    } else {
      // Append new
      nextItems = [...b.items, msg];
    }

    seen.add(msg.id);

    const updated: ChatBucket = { ...b, items: nextItems, seenIds: seen };
    return { ...s, byChat: { ...byChat2, [chatId]: updated } };
  });
},

}));

const requireAuthId = (): number => {
  const u = useAuthStore.getState().user;
  if (!u) throw new Error("Not authenticated");
  return u.id;
};
