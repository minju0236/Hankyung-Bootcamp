"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(persist((set) => ({
  token: "",
  sessionId: "",
  profile: null,
  setAuth: (auth) => set({ token: auth.token, sessionId: auth.sessionId, profile: auth }),
  logout: () => set({ token: "", sessionId: "", profile: null })
}), { name: "mobile-bank-auth" }));
