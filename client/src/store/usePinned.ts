import { create } from "zustand";

/** What can be shown in the pinned banner. */
export type PinnedItem =
  | { id: string | number; author: string; kind: "text"; text: string }
  | { id: string | number; author: string; kind: "file"; filename: string }
  | {
      id: string | number;
      author: string;
      kind: "media";
      /** “Photo” or “Video” */
      label: "Photo" | "Video";
      /** optional thumbnail for images (or the first media) */
      thumb?: string;
    };

type State = {
  pinned: PinnedItem | null;
  /** Set/replace current pinned banner content (local UI). */
  setPinned: (item: PinnedItem) => void;
  /** Hide pinned banner. */
  clearPinned: () => void;
};

export const usePinned = create<State>()((set) => ({
  pinned: null,
  setPinned: (item) => set({ pinned: item }),
  clearPinned: () => set({ pinned: null }),
}));
