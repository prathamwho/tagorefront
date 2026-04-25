import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const emptyDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

const areStringArraysEqual = (a = [], b = []) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export const useWorkspaceStore = create((set, get) => ({
  projectId: null,
  manuscriptContent: emptyDocument,
  activePapers: [],
  milestones: [],
  saveStatus: "Saved",
  lastAutoSavedAt: null,
  error: null,
  isCreatingWorkspace: false,

  setProjectId: (projectId) =>
    set((state) => (state.projectId === projectId ? state : { projectId })),

  setManuscriptContent: (manuscriptContent) =>
    set({
      manuscriptContent,
      saveStatus: "Unsaved changes",
    }),

  loadManuscriptSnapshot: (manuscriptContent) =>
    set({
      manuscriptContent,
      saveStatus: "Saved",
    }),

  setActivePapers: (activePapers) =>
    set((state) => {
      const nextActivePapers = activePapers.map(String);
      if (areStringArraysEqual(state.activePapers, nextActivePapers)) return state;
      return {
        activePapers: nextActivePapers,
        saveStatus: "Unsaved changes",
      };
    }),

  loadActivePapersSnapshot: (activePapers) =>
    set((state) => {
      const nextActivePapers = activePapers.map(String);
      if (areStringArraysEqual(state.activePapers, nextActivePapers) && state.saveStatus === "Saved") {
        return state;
      }
      return {
        activePapers: nextActivePapers,
        saveStatus: "Saved",
      };
    }),

  setMilestones: (milestones) => set({ milestones }),

  createWorkspaceProject: async (payload = {}) => {
    const existingProjectId = get().projectId;
    if (existingProjectId) return existingProjectId;
    const workspaceSeed = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      set({ isCreatingWorkspace: true, error: null });
      const res = await axiosInstance.post("/projects", {
        title: payload.title || `Untitled Research Project ${workspaceSeed}`,
        abstract: payload.abstract || "Workspace draft created from Tagore Scribe.",
        description: payload.description || `Workspace draft created from Tagore Scribe ${workspaceSeed}.`,
        content: payload.content || "",
        category: payload.category || "Workspace",
        tags: payload.tags || [],
        fundingGoal: Number(payload.fundingGoal) || 0,
      });

      const projectId = res.data?._id;
      if (!projectId) {
        throw new Error(res.data?.message || "Project creation returned no ID");
      }

      get().hydrateFromProject(res.data);
      set({ isCreatingWorkspace: false, error: null });
      return projectId;
    } catch (error) {
      console.error("Unable to create workspace project", error);
      set({
        isCreatingWorkspace: false,
        error: error?.response?.data?.message || error?.message || "Unable to create workspace project",
      });
      return null;
    }
  },

  fetchMilestones: async (projectId = get().projectId) => {
    if (!projectId) return [];

    try {
      const res = await axiosInstance.get(`/projects/${projectId}/milestones`);
      const milestones = res.data || [];
      set({ milestones, error: null });
      return milestones;
    } catch (error) {
      console.error("Unable to fetch milestones", error);
      set({
        error: error?.response?.data?.message || "Unable to fetch milestones",
      });
      return [];
    }
  },

  hydrateFromProject: (project) =>
    set({
      projectId: project?._id || project?.id || get().projectId,
      manuscriptContent: project?.currentManuscript || emptyDocument,
      activePapers: Array.isArray(project?.activePapers) ? project.activePapers : [],
      lastAutoSavedAt: project?.lastAutoSavedAt || null,
      saveStatus: "Saved",
      error: null,
    }),

  fetchWorkspace: async (projectId) => {
    if (!projectId) return null;

    try {
      set({ projectId, error: null });
      const [projectRes, milestonesRes] = await Promise.all([
        axiosInstance.get(`/projects/${projectId}`),
        axiosInstance.get(`/projects/${projectId}/milestones`),
      ]);

      get().hydrateFromProject(projectRes.data);
      set({ milestones: milestonesRes.data || [] });

      return projectRes.data;
    } catch (error) {
      console.error("Unable to fetch workspace", error);
      set({
        error: error?.response?.data?.message || "Unable to fetch workspace",
        saveStatus: "Unsaved changes",
      });
      return null;
    }
  },

  saveDraft: async (payload = {}) => {
    const projectId = payload.projectId || get().projectId;
    if (!projectId) {
      set({ saveStatus: "Unsaved changes" });
      return null;
    }

    const currentManuscript = payload.currentManuscript ?? get().manuscriptContent;
    const activePapers = payload.activePapers ?? get().activePapers;

    try {
      set({ saveStatus: "Saving...", error: null });
      const res = await axiosInstance.patch(`/projects/${projectId}/draft`, {
        currentManuscript,
        activePapers,
      });

      set({
        manuscriptContent: res.data.currentManuscript || currentManuscript,
        activePapers: res.data.activePapers || activePapers,
        lastAutoSavedAt: res.data.lastAutoSavedAt || new Date().toISOString(),
        saveStatus: "Saved",
        error: null,
      });

      return res.data;
    } catch (error) {
      console.error("Unable to auto-save draft", error);
      set({
        saveStatus: "Unsaved changes",
        error: error?.response?.data?.message || "Unable to auto-save draft",
      });
      return null;
    }
  },

  createMilestone: async ({ title, evolutionContext, isMajor, currentManuscript, activePapers }) => {
    const projectId = get().projectId;
    if (!projectId) {
      set({ error: "Unable to prepare workspace before creating a milestone" });
      return null;
    }

    const flushedDraft = await get().saveDraft({
      projectId,
      currentManuscript: currentManuscript ?? get().manuscriptContent,
      activePapers: activePapers ?? get().activePapers,
    });

    if (!flushedDraft) return null;

    try {
      const res = await axiosInstance.post(`/projects/${projectId}/milestones`, {
        title,
        evolutionContext,
        isMajor,
      });

      const milestone = res.data;
      set((state) => ({
        milestones: [milestone, ...state.milestones.filter((item) => item._id !== milestone._id)],
        saveStatus: "Saved",
        error: null,
      }));

      return milestone;
    } catch (error) {
      console.error("Unable to create milestone", error);
      set({
        error: error?.response?.data?.message || "Unable to create milestone",
      });
      return null;
    }
  },
}));
