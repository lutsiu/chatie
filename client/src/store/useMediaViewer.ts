import { create } from 'zustand';

export type MediaItem = {
  id: string | number;
  url: string;
  type: 'image' | 'video';
  filename?: string;
};

type MediaViewerState = {
  isOpen: boolean;
  items: MediaItem[];
  index: number;
  onDelete?: (item: MediaItem) => void;

  open: (items: MediaItem[], start?: number | string, onDelete?: (item: MediaItem) => void) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  setIndex: (i: number) => void;
};

export const useMediaViewer = create<MediaViewerState>((set, get) => ({
  isOpen: false,
  items: [],
  index: 0,
  onDelete: undefined,

  open: (items, start, onDelete) => {
    let idx = 0;
    if (typeof start === 'number') idx = Math.max(0, Math.min(start, items.length - 1));
    if (typeof start === 'string') {
      const found = items.findIndex(i => String(i.id) === start);
      idx = found >= 0 ? found : 0;
    }
    set({ items, index: idx, isOpen: true, onDelete });
  },

  close: () => set({ isOpen: false }),

  next: () => {
    const { index, items } = get();
    if (index < items.length - 1) set({ index: index + 1 });
  },

  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1 });
  },

  setIndex: (i) => {
    const { items } = get();
    set({ index: Math.max(0, Math.min(i, items.length - 1)) });
  },
}));
