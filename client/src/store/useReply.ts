// src/store/useReply.ts
import { create } from "zustand";

/** Base of every reply target. We keep `id` strictly as a number in the store. */
type ReplyBase = {
  id: number;
  author: string;
};

export type ReplyTarget =
  | (ReplyBase & { kind: "text";  text: string })
  | (ReplyBase & { kind: "file";  filename: string })
  | (ReplyBase & { kind: "media"; thumb: string; label: "Photo" | "Video" });

/** Accept string|number ids when starting a reply (we’ll coerce to number). */
export type StartReplyInput =
  | ({ id: string | number; author: string } & (
        | { kind: "text";  text: string }
        | { kind: "file";  filename: string }
        | { kind: "media"; thumb: string; label: "Photo" | "Video" }
      ));

type State = {
  target: ReplyTarget | null;
  start: (t: StartReplyInput) => void;
  clear: () => void;
  replyToId: () => number | null;
};

export const useReply = create<State>()((set, get) => ({
  target: null,

  start: (t) => {
    const numericId = typeof t.id === "number" ? t.id : Number(t.id);
    if (!Number.isFinite(numericId)) {
      console.warn("[useReply] start(): invalid id", t.id);
      return;
    }

    // Remove incoming `id` without keeping an unused variable
    const rest: any = { ...t };
    delete rest.id;

    set({ target: { ...rest, id: numericId } as ReplyTarget });
  },

  clear: () => set({ target: null }),

  replyToId: () => get().target?.id ?? null,
}));

/* ---------- Tiny selector helpers ---------- */

/** Primitive selector for current replyToId (keeps TS happy, no equality fn). */
export const useReplyToId = (): number | null =>
  useReply((s) => s.target?.id ?? null);

/** Full target (useful for ReplyBanner). */
export const useReplyTarget = () => useReply((s) => s.target);
