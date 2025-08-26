import { create } from "zustand";
import { getUserByIdApi, type User } from "../api/users";

type PeerState = {
  byId: Record<number, User>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;
  get: (id: number) => User | undefined;
  ensure: (id: number) => Promise<User>;
  clear: (id?: number) => void;
};

export const usePeerStore = create<PeerState>()((set, get) => ({
  byId: {},
  loading: {},
  error: {},

  get: (id) => get().byId[id],

  ensure: async (id: number) => {
    const cached = get().byId[id];
    if (cached) return cached;

    set((s) => ({
      loading: { ...s.loading, [id]: true },
      error: { ...s.error, [id]: null },
    }));

    try {
      const user = await getUserByIdApi(id);
      set((s) => ({
        byId: { ...s.byId, [id]: user },
        loading: { ...s.loading, [id]: false },
      }));
      return user;
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load user";
      set((s) => ({
        loading: { ...s.loading, [id]: false },
        error: { ...s.error, [id]: msg },
      }));
      throw e;
    }
  },

  clear: (id?: number) => {
    if (id == null) {
      set({ byId: {}, loading: {}, error: {} });
      return;
    }
    const { byId, loading, error } = get();
    const { [id]: _a, ...restU } = byId;
    const { [id]: _b, ...restL } = loading;
    const { [id]: _c, ...restE } = error;
    set({ byId: restU, loading: restL, error: restE });
  },
}));
