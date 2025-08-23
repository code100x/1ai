"use client";

import { create } from "zustand";
import { AuthState, AppUser } from "./types";

interface AuthActions {
  setToken: (token: string | null) => void;
  setUser: (user: AppUser | null) => void;
  signOut: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  
  setToken: (token) => 
    set({ 
      token, 
      isAuthenticated: !!token 
    }),
  
  setUser: (user) => set({ user }),
  
  signOut: () => 
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false 
    }),
}));
