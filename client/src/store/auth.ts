import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginApi, refreshApi, type AuthResponse, type LoginBody } from "../api/auth";
import { registerApi, type RegisterBody, type User } from "../api/users";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // actions
  register: (body: RegisterBody) => Promise<void>;
  login: (body: LoginBody) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<string | null>;
  setAuth: (payload: AuthResponse) => void;
  setUser: (u: User | null) => void; 
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoading: false,
      error: null,

      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),

      setUser: (u) => set({ user: u }), 

      register: async (body) => {
        set({ isLoading: true, error: null });
        try {
          const created = await registerApi(body);
          const auth = await loginApi({ identifier: created.username, password: body.password });
          set({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, user: auth.user });
        } catch (e: any) {
          const msg = e?.response?.data?.message || e?.message || "Registration failed";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (body) => {
        set({ isLoading: true, error: null });
        try {
          const auth = await loginApi(body);
          set({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, user: auth.user });
        } catch (e: any) {
          const msg = e?.response?.data?.message || e?.message || "Login failed";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },

      refreshTokens: async () => {
        const rt = get().refreshToken;
        if (!rt) return null;
        try {
          const refreshed = await refreshApi(rt);
          set({ accessToken: refreshed.accessToken, refreshToken: refreshed.refreshToken, user: refreshed.user });
          return refreshed.accessToken;
        } catch {
          return null; 
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    }
  )
);
