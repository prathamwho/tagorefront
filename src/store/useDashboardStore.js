import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const initialState = {
  profile: null,
  workspaces: [],
  activityFeed: [],
  chartData: [],
  stats: {
    workspaceCount: 0,
    milestoneCount: 0,
    totalChartMilestones: 0,
  },
  isLoading: false,
  error: null,
};

export const useDashboardStore = create((set) => ({
  ...initialState,

  fetchDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.get("/dashboard/me");

      set({
        profile: res.data.profile || null,
        workspaces: Array.isArray(res.data.workspaces) ? res.data.workspaces : [],
        activityFeed: Array.isArray(res.data.activityFeed) ? res.data.activityFeed : [],
        chartData: Array.isArray(res.data.chartData) ? res.data.chartData : [],
        stats: res.data.stats || initialState.stats,
        isLoading: false,
        error: null,
      });

      return res.data;
    } catch (error) {
      console.error("Unable to fetch dashboard data", error);
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Unable to load dashboard",
      });
      return null;
    }
  },

  resetDashboard: () => set(initialState),
}));
