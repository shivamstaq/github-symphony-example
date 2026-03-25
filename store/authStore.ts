import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_CREDENTIALS } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email: string, password: string) => {
        if (
          email === MOCK_CREDENTIALS.email &&
          password === MOCK_CREDENTIALS.password
        ) {
          set({ isAuthenticated: true, user: { email } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "auth-storage" }
  )
);
