import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const emptyDocument = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const manuscriptTab = {
  id: "manuscript",
  type: "text",
  title: "Manuscript",
  content: emptyDocument,
};

const areStringArraysEqual = (a = [], b = []) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const normalizePaper = (paper) => {
  const bib = paper?.bibjson || {};
  const rawUrl = paper?.rawUrl || bib?.link?.[0]?.url || "";

  return {
    id: String(paper?.id || ""),
    type: "paper",
    title: paper?.title || bib?.title || "Untitled Paper",
    authors: paper?.authors || bib?.author?.map((author) => author.name).join(", ") || "",
    venue: paper?.venue || bib?.journal?.title || "",
    year: String(paper?.year || bib?.year || ""),
    abstract: paper?.abstract || bib?.abstract || "No abstract available",
    rawUrl,
    pdfUrl: paper?.pdfUrl || (rawUrl.endsWith(".pdf") ? rawUrl : ""),
  };
};

const normalizeUpload = (file) => ({
  id: String(file.id),
  type: file.type || "file",
  title: file.name || "Untitled Upload",
  name: file.name || "Untitled Upload",
  url: file.url,
  size: file.size || 0,
  mimeType: file.mimeType || "",
  folderPath: file.folderPath || "",
  createdAt: file.createdAt,
});

const normalizeDoc = (doc) => ({
  id: String(doc.id),
  type: doc.type || "text",
  title: doc.name || "Untitled Document",
  name: doc.name || "Untitled Document",
  content: doc.content ?? "",
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const normalizeWorkspace = (workspace = {}) => ({
  papers: Array.isArray(workspace.papers) ? workspace.papers.map(normalizePaper).filter((paper) => paper.id) : [],
  uploads: Array.isArray(workspace.uploadedFiles) ? workspace.uploadedFiles.map(normalizeUpload) : [],
  docs: Array.isArray(workspace.authoredDocs) ? workspace.authoredDocs.map(normalizeDoc) : [],
});

const buildWorkspacePayload = (state) => ({
  activePapers: state.activePapers,
  paperLibrary: state.workspaceData.papers,
});

export const useWorkspaceStore = create((set, get) => ({
  projectId: null,
  manuscriptContent: emptyDocument,
  activePapers: [],
  milestones: [],
  saveStatus: "Saved",
  lastAutoSavedAt: null,
  error: null,
  isCreatingWorkspace: false,
  isUploading: false,
  activeTabId: "manuscript",
  openTabs: [manuscriptTab],
  workspaceData: {
    papers: [],
    uploads: [],
    docs: [],
  },

  setProjectId: (projectId) =>
    set((state) => (state.projectId === projectId ? state : { projectId })),

  setActiveTab: (activeTabId) => set({ activeTabId }),

  openTab: (item) =>
    set((state) => {
      const tab = {
        ...item,
        title: item.title || item.name || "Untitled",
      };
      const exists = state.openTabs.some((openTab) => openTab.id === tab.id);
      const nextActivePapers =
        tab.type === "paper" && !state.activePapers.includes(tab.id)
          ? [...state.activePapers, tab.id]
          : state.activePapers;

      return {
        openTabs: exists ? state.openTabs : [...state.openTabs, tab],
        activeTabId: tab.id,
        activePapers: nextActivePapers,
        saveStatus: tab.type === "paper" && !areStringArraysEqual(state.activePapers, nextActivePapers)
          ? "Unsaved changes"
          : state.saveStatus,
      };
    }),

  closeTab: (id) =>
    set((state) => {
      const closedTab = state.openTabs.find((tab) => tab.id === id);
      const openTabs = state.openTabs.filter((tab) => tab.id !== id);
      const activePapers =
        closedTab?.type === "paper"
          ? state.activePapers.filter((paperId) => paperId !== id)
          : state.activePapers;
      const activeTabId =
        state.activeTabId === id
          ? openTabs[openTabs.length - 1]?.id || null
          : state.activeTabId;

      return {
        openTabs,
        activeTabId,
        activePapers,
        saveStatus: closedTab?.type === "paper" ? "Unsaved changes" : state.saveStatus,
      };
    }),

  setManuscriptContent: (manuscriptContent) =>
    set({
      manuscriptContent,
      saveStatus: "Unsaved changes",
    }),

  loadManuscriptSnapshot: (manuscriptContent) =>
    set((state) => ({
      manuscriptContent,
      openTabs: state.openTabs.some((tab) => tab.id === "manuscript")
        ? state.openTabs
        : [manuscriptTab, ...state.openTabs],
      activeTabId: "manuscript",
      saveStatus: "Saved",
    })),

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
      const paperTabs = state.workspaceData.papers.filter((paper) => nextActivePapers.includes(paper.id));
      const nonPaperTabs = state.openTabs.filter((tab) => tab.type !== "paper");
      const activeTabId = nextActivePapers.includes(state.activeTabId)
        ? state.activeTabId
        : paperTabs[0]?.id || "manuscript";

      return {
        activePapers: nextActivePapers,
        openTabs: [...nonPaperTabs, ...paperTabs],
        activeTabId,
        saveStatus: "Saved",
      };
    }),

  setMilestones: (milestones) => set({ milestones }),

  hydrateWorkspace: (workspace) =>
    set((state) => {
      const workspaceData = normalizeWorkspace(workspace);
      const activePapers = Array.isArray(workspace?.activePapers)
        ? workspace.activePapers.map(String)
        : workspaceData.papers.map((paper) => paper.id);
      const paperTabs = workspaceData.papers.filter((paper) => activePapers.includes(paper.id));
      const docs = workspaceData.docs;
      const openTabs = [
        { ...manuscriptTab, content: workspace?.currentManuscript || emptyDocument },
        ...paperTabs,
        ...docs.filter((doc) => state.openTabs.some((tab) => tab.id === doc.id)),
      ];

      return {
        projectId: workspace?.projectId || workspace?._id || workspace?.id || state.projectId,
        manuscriptContent: workspace?.currentManuscript || emptyDocument,
        activePapers,
        workspaceData,
        openTabs,
        activeTabId: openTabs.some((tab) => tab.id === state.activeTabId) ? state.activeTabId : "manuscript",
        lastAutoSavedAt: workspace?.lastAutoSavedAt || null,
        saveStatus: "Saved",
        error: null,
      };
    }),

  hydrateFromProject: (project) =>
    get().hydrateWorkspace({
      projectId: project?._id || project?.id || get().projectId,
      title: project?.title,
      currentManuscript: project?.currentManuscript || emptyDocument,
      activePapers: Array.isArray(project?.activePapers) ? project.activePapers : [],
      papers: Array.isArray(project?.paperLibrary) ? project.paperLibrary : [],
      uploadedFiles: Array.isArray(project?.uploadedFiles) ? project.uploadedFiles : [],
      authoredDocs: Array.isArray(project?.authoredDocs) ? project.authoredDocs : [],
      lastAutoSavedAt: project?.lastAutoSavedAt || null,
    }),

  createWorkspaceProject: async (payload = {}) => {
    const existingProjectId = get().projectId;
    if (existingProjectId) return existingProjectId;
    const selectedPapers = Array.isArray(payload.selectedPapers) ? payload.selectedPapers.map(normalizePaper) : [];
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
        activePapers: selectedPapers.map((paper) => paper.id),
        paperLibrary: selectedPapers,
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

  fetchWorkspace: async (projectId) => {
    if (!projectId) return null;

    try {
      set({ projectId, error: null });
      const [workspaceRes, milestonesRes] = await Promise.all([
        axiosInstance.get(`/projects/${projectId}/workspace`),
        axiosInstance.get(`/projects/${projectId}/milestones`),
      ]);

      get().hydrateWorkspace(workspaceRes.data);
      set({ milestones: milestonesRes.data || [] });

      return workspaceRes.data;
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
        ...buildWorkspacePayload(get()),
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

  uploadFile: async (projectId = get().projectId, fileList = []) => {
    const files = Array.from(fileList);
    if (!projectId || files.length === 0) return [];

    try {
      set({ isUploading: true, error: null });
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
        formData.append("paths", file.webkitRelativePath || file.name);
      });

      const res = await axiosInstance.post(`/projects/${projectId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      get().hydrateWorkspace(res.data.workspace);
      if (res.data.uploadedFiles?.[0]) {
        get().openTab(normalizeUpload(res.data.uploadedFiles[0]));
      }
      set({ isUploading: false, error: null });
      return res.data.uploadedFiles || [];
    } catch (error) {
      console.error("Unable to upload file", error);
      set({
        isUploading: false,
        error: error?.response?.data?.message || "Unable to upload file",
      });
      return [];
    }
  },

  createDoc: async (type = "text") => {
    const projectId = get().projectId;
    if (!projectId) {
      set({ error: "Create a workspace before adding documents" });
      return null;
    }

    try {
      const res = await axiosInstance.post(`/projects/${projectId}/docs`, { type });
      const doc = normalizeDoc(res.data.doc);
      get().hydrateWorkspace(res.data.workspace);
      get().openTab(doc);
      return doc;
    } catch (error) {
      console.error("Unable to create document", error);
      set({
        error: error?.response?.data?.message || "Unable to create document",
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
