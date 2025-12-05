import { create } from "zustand";

export type EditTarget = {
  id: number;
  content: string;
};

type EditState = {
  target: EditTarget | null;
  start: (id: number, content: string) => void;
  clear: () => void;
};

export const useEditMessage = create<EditState>((set) => ({
  target: null,
  start: (id, content) => set({ target: { id, content } }),
  clear: () => set({ target: null }),
}));
