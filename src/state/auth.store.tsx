// src/state/auth.store.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type User = { id: string; email: string };
type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  login: (t: string, u: User) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  login: async (token, user) => {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    set({ token: token, user: user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    set({ token: null, user: null });
  },

  hydrate: async () => {
    const token = await SecureStore.getItemAsync("token");
    const userStr = await SecureStore.getItemAsync("user");
    set({ token: token ?? null, user: userStr ? JSON.parse(userStr) : null, hydrated: true });
  },
}));