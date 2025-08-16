// src/store/useAttachment.ts
import { create } from "zustand";

export type AttachMode = "document" | "media" | null;

type State = {
  isOpen: boolean;
  mode: AttachMode;
  files: File[];        // 1 for document, up to 5 for media (later)
  caption: string;
};

type Actions = {
  open: (mode: AttachMode) => void;
  close: () => void;
  setFiles: (files: File[]) => void;
  clearFiles: () => void;
  setCaption: (v: string) => void;
};

export const useAttachment = create<State & Actions>((set) => ({
  isOpen: false,
  mode: null,
  files: [],
  caption: "",

  open: (mode) => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false, mode: null, files: [], caption: "" }),

  setFiles: (files) => set({ files }),
  clearFiles: () => set({ files: [] }),
  setCaption: (v) => set({ caption: v }),
}));
