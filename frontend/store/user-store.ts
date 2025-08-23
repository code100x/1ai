"use client";

import { create } from "zustand";
import { UserState } from "./types";

interface UserActions {
  setCredits: (credits: number) => void;
  setIsPremium: (isPremium: boolean) => void;
  updateUserData: (data: Partial<UserState>) => void;
  reset: () => void;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set) => ({
  credits: 0,
  isPremium: false,
  
  setCredits: (credits) => set({ credits }),
  setIsPremium: (isPremium) => set({ isPremium }),
  updateUserData: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set({ credits: 0, isPremium: false }),
}));
