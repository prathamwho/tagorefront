import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const normalizeDOAJ = (paper) => {
    const bib = paper.bibjson || {};
    return {
        id: paper.id,
        title: bib.title || "Untitled Research",
        authors: bib.author?.map(a => a.name).join(", ") || "Unknown Researchers",
        institution: bib.institution || bib.publisher || "Academic Institution",
        category: bib.subject?.[0]?.term || "General Science",
        abstract: bib.abstract || "",
        year: bib.year || "2024",
        source: "DOAJ",
        externalUrl: bib.link?.[0]?.url || "",
        tags: bib.keywords || [],
    };
};

const getMockFunding = (id) => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const goal = ((seed % 6) * 1000) + 5000; 
    
    const percentage = ((seed % 70) + 15) / 100;
    const raised = Math.floor(goal * percentage) + (seed % 97); 
    
    return {
        fundingGoal: goal,
        amountRaised: Math.min(raised, goal - 150), // Ensure never fully funded
        daysLeft: (seed % 23) + 7 // 7 to 30 days
    };
};

export const useResearchStore = create((set, get) => ({
    featuredPapers: [],
    gridPapers: [],
    selectedPaper: null,
    isLoading: false,

    fetchDiscovery: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/article/discovery-feed");
            set({ featuredPapers: res.data.featured, gridPapers: res.data.grid, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    fetchPaperById: async (id) => {
        set({ isLoading: true, selectedPaper: null });
        try {
            const existing = [...get().gridPapers, ...get().featuredPapers].find(p => p.id === id);
            if (existing) {
                set({ selectedPaper: { ...existing, ...getMockFunding(id) }, isLoading: false });
                return;
            }
            const res = await axiosInstance.post("/article/getSinglePaper", { articleId: id });
            set({ 
                selectedPaper: { ...normalizeDOAJ(res.data), ...getMockFunding(id) },
                isLoading: false 
            });
        } catch (error) {
            set({ isLoading: false });
        }
    }
}));