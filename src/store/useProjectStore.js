import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProjectStore = create((set) => ({
  projects: [],
  selectedProject: null, // Stores the single project data for the detailed view
  isFetchingProjects: false,

  // 1. Fetch All Projects (For Discover Page - Public)
  getAllProjects: async () => {
    set({ isFetchingProjects: true });
    try {
      const res = await axiosInstance.get("/projects"); // Hits GET /api/projects
      set({ projects: res.data });
    } catch (error) {
      console.log("Error fetching projects:", error);
      toast.error(error.response?.data?.message || "Failed to load research papers");
    } finally {
      set({ isFetchingProjects: false });
    }
  },

  // 2. Fetch Logged-in User's Projects (For Profile Page - Private)
  getMyProjects: async () => {
    set({ isFetchingProjects: true });
    try {
      const res = await axiosInstance.get("/projects/my-projects"); // Hits GET /api/projects/my-projects
      set({ projects: res.data });
    } catch (error) {
      console.log("Error fetching my projects:", error);
      // We generally don't toast here to avoid annoying popups on profile load if empty
    } finally {
      set({ isFetchingProjects: false });
    }
  },

  // 3. Fetch Single Project by ID (For Paper View / Funding Page)
  getProjectById: async (id) => {
    set({ isFetchingProjects: true });
    try {
      const res = await axiosInstance.get(`/projects/${id}`); // Hits GET /api/projects/:id
      set({ selectedProject: res.data });
    } catch (error) {
      console.log("Error fetching project details:", error);
      toast.error("Could not load project details");
      set({ selectedProject: null });
    } finally {
      set({ isFetchingProjects: false });
    }
  },

  // 4. Create New Project (For Publishing)
  createProject: async (projectData) => {
    try {
      const res = await axiosInstance.post("/projects", projectData);
      set((state) => ({ projects: [res.data, ...state.projects] }));
      toast.success("Project published successfully!");
      return true; // Return true so UI knows to close modal/redirect
    } catch (error) {
      console.log("Error creating project:", error);
      toast.error(error.response?.data?.message || "Failed to publish");
      return false;
    }
  }
}));