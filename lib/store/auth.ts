import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  institution_name: string | null;
  investor_type_id: number | null;
  business_name: string | null;
  business_type_id: number | null;
  industry_id: number | null;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  token_type: string | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    user: User;
    access_token: string;
    token_type: string;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      token_type: null,
      isAuthenticated: false,
      setAuth: (data) =>
        set({
          user: data.user,
          access_token: data.access_token,
          token_type: data.token_type,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          user: null,
          access_token: null,
          token_type: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

