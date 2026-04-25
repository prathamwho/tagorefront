import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEditorStore = create(
  persist(
    (set) => ({
      content: {},           // live Tiptap JSON — single source of truth for the editor
      presentSnapshot: null, // draft captured before first time-travel (session only)

      setContent:           (json)     => set({ content: json }),
      setPresentSnapshot:   (snapshot) => set({ presentSnapshot: snapshot }),
      clearPresentSnapshot: ()         => set({ presentSnapshot: null }),
    }),
    {
      name: "tagore-editor",
      // Only persist the working manuscript text.
      // activePapers lives in useWorkspaceStore (no persist middleware) to avoid
      // forceStoreRerender loops. presentSnapshot is session-only (not persisted).
      partialize: (state) => ({ content: state.content }),
    }
  )
);
