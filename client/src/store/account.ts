import { create } from "zustand";
import { updateMeApi, uploadMyAvatarApi, type UpdateMeBody, type User } from "../api/users";
import { useAuthStore } from "./auth";

type AccountState = {
  isSaving: boolean;
  isUploading: boolean;
  error: string | null;

  updateMe: (patch: UpdateMeBody) => Promise<User>;
  uploadAvatar: (file: File) => Promise<User>;
};

export const useAccountStore = create<AccountState>()((set) => ({
  isSaving: false,
  isUploading: false,
  error: null,

  async updateMe(patch) {
    set({ isSaving: true, error: null });
    try {
      const updated = await updateMeApi(patch);
      useAuthStore.getState().setUser(updated); // sync auth user
      set({ isSaving: false });
      return updated;
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Update failed", isSaving: false });
      throw e;
    }
  },

  async uploadAvatar(file) {
    set({ isUploading: true, error: null });
    try {
      const updated = await uploadMyAvatarApi(file);
      useAuthStore.getState().setUser(updated);
      set({ isUploading: false });
      return updated;
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? "Avatar upload failed", isUploading: false });
      throw e;
    }
  },
}));
