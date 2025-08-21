// src/store/usePinned.ts
import { create } from "zustand";
import type { ReplyTarget } from "./useReply";

type State = {
  pinned: ReplyTarget | null;
  setPinned: (t: ReplyTarget) => void;
  clearPinned: () => void;
};

export const usePinned = create<State>((set) => ({
  pinned: null,
  setPinned: (t) => set({ pinned: t }),
  clearPinned: () => set({ pinned: null }),
}));
