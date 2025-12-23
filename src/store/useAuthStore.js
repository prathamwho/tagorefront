import { create } from "zustand";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  // 1. Check if user is already logged in (when app loads)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 2. Sign Up
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.savedUser }); // Backend returns { savedUser: ... }
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Error in signup:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 3. Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.oldUser }); // Backend returns { oldUser: ... }
      toast.success("Logged in successfully!");
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 4. Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully!")
      set({ authUser: null });
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Problem logging out!");
    }
  },
}));
