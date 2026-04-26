import { create } from "zustand";

// Milestones are now owned by useWorkspaceStore (fetched from MongoDB).
// This store only manages UI-layer lineage state that has no backend equivalent.
export const useLineageStore = create((set) => ({
  isModalOpen: false,
  activeMilestoneId: null, // which sealed snapshot the researcher is currently viewing

  openModal:  () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  setActiveMilestoneId: (id) => set({ activeMilestoneId: id }),
}));
