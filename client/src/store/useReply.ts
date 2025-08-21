import { create } from "zustand";

export type ReplyTarget =
  | { id: string | number; author: string; kind: "text"; text: string }
  | { id: string | number; author: string; kind: "file"; filename: string }
  | { id: string | number; author: string; kind: "media"; thumb: string; label: "Photo" | "Video" };

type State = {
  target: ReplyTarget | null;
  start: (t: ReplyTarget) => void;
  clear: () => void;
};

export const useReply = create<State>((set) => ({
  target: null,
  start: (t) => set({ target: t }),
  clear: () => set({ target: null }),
}));
