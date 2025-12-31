import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,

  setAuthUser: (user) => set({ authUser: user }),
  setIsSigningUp: (val) => set({ isSigningUp: val }),
  setIsLoggingIn: (val) => set({ isLoggingIn: val }),
  setIsCheckingAuth: (val) => set({ isCheckingAuth: val }),
}));
