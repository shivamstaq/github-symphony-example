import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_CREDENTIALS } from "@/types";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        if (
          email === MOCK_CREDENTIALS.email &&
          password === MOCK_CREDENTIALS.password
        ) {
          set({
            user: { email, name: "Demo User" },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-store" }
  )
);
