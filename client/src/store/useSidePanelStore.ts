import { create } from 'zustand';

type Panel = 'none' | 'contacts' | 'settings' | 'editProfile';

type State = {
  panel: Panel;
  open: (p: Panel) => void;
  back: () => void;   
  close: () => void;
};

export const useSidePanelStore = create<State>((set, get) => ({
  panel: 'none',
  open: (p) => set({ panel: p }),
  back: () => {
    const { panel } = get();
    if (panel === 'editProfile') return set({ panel: 'settings' });
    set({ panel: 'none' });
  },
  close: () => set({ panel: 'none' }),
}));
