import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBigLeftDash, Cloud, MoreHorizontal, Settings, Share2, Sparkles, X } from "lucide-react";
import ChatPanel from "../components/layout/ChatPanel.jsx";
import MilestoneModal from "../components/lineage/MilestoneModal.jsx";
import LineageSidebar from "../components/lineage/LineageSidebar.jsx";
import WorkspaceSidebar from "../components/workspace/WorkspaceSidebar.jsx";
import CenterPreviewer from "../components/workspace/CenterPreviewer.jsx";
import { useEditorStore } from "../store/useEditorStore.js";
import { useLineageStore } from "../store/useLineageStore.js";
import { useWorkspaceStore } from "../store/useWorkspaceStore.js";

const ProjectWorkspace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId: routeProjectId } = useParams();
  const selectedPapers = useMemo(
    () => location.state?.selectedPapers || [],
    [location.state?.selectedPapers]
  );
  const initialProjectId = routeProjectId || location.state?.projectId || null;

  const setContent = useEditorStore((state) => state.setContent);
  const openModal = useLineageStore((state) => state.openModal);
  const projectId = useWorkspaceStore((state) => state.projectId);
  const saveStatus = useWorkspaceStore((state) => state.saveStatus);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const activeTabId = useWorkspaceStore((state) => state.activeTabId);
  const createWorkspaceProject = useWorkspaceStore((state) => state.createWorkspaceProject);
  const fetchWorkspace = useWorkspaceStore((state) => state.fetchWorkspace);
  const setProjectId = useWorkspaceStore((state) => state.setProjectId);
  const error = useWorkspaceStore((state) => state.error);

  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState("lineage");
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const bootWorkspace = async () => {
      if (initialProjectId) {
        setProjectId(initialProjectId);
        const workspace = await fetchWorkspace(initialProjectId);
        if (workspace?.currentManuscript) setContent(workspace.currentManuscript);
        return;
      }

      const createdProjectId = await createWorkspaceProject({
        selectedPapers,
      });

      if (!createdProjectId) return;
      navigate(`/workspace/ide/${createdProjectId}`, {
        replace: true,
        state: {
          ...location.state,
          projectId: createdProjectId,
          selectedPapers,
        },
      });
    };

    bootWorkspace();
  }, [
    createWorkspaceProject,
    fetchWorkspace,
    initialProjectId,
    location.state,
    navigate,
    selectedPapers,
    setContent,
    setProjectId,
  ]);

  const activePaperGlow = workspaceData.papers.some((paper) => paper.id === activeTabId);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#070b10] text-slate-200">
      <header className="h-16 shrink-0 border-b border-white/10 bg-[#080d12]/95 flex items-center justify-between px-5">
        <div className="flex items-center gap-5">
          <Link to="/workspace" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-amber-500/50 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
              T
            </div>
            <span className="text-lg font-bold tracking-wide text-amber-400">TAGORE</span>
          </Link>

          <div className="h-8 w-px bg-white/10" />

          <div>
            <p className="text-sm font-semibold text-white">Research Workspace</p>
            <p className="text-[11px] text-slate-500">
              {projectId ? `Project ${projectId.slice(-6)}` : "Preparing workspace"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`hidden sm:flex items-center gap-2 rounded-full border px-3 py-1 text-xs
              ${saveStatus === "Saved"
                ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
                : saveStatus === "Saving..."
                  ? "border-blue-500/30 text-blue-300 bg-blue-500/10"
                  : "border-amber-500/30 text-amber-300 bg-amber-500/10"
              }`}
          >
            <Cloud size={13} />
            {saveStatus}
          </span>

          <button
            type="button"
            onClick={openModal}
            className="rounded-xl border border-amber-500/70 px-4 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-500/10"
          >
            Register Milestone
          </button>

          <button className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.04]">
            <Share2 size={16} />
          </button>
          <Settings size={18} className="text-slate-500" />
          <MoreHorizontal size={18} className="text-slate-500" />
        </div>
      </header>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <WorkspaceSidebar />
        <CenterPreviewer />

        {rightPanelOpen ? (
          <aside className="w-80 shrink-0 flex flex-col min-h-0 border-l border-white/10 bg-[#080d12]">
            <div className="h-11 shrink-0 border-b border-white/10 flex items-center px-2">
              <div className="flex-1 flex gap-1">
                {["chat", "lineage"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setRightPanelTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize
                      ${rightPanelTab === tab
                        ? "bg-amber-500/10 text-amber-300"
                        : "text-slate-500 hover:text-slate-200"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setRightPanelOpen(false)}>
                <X size={15} className="text-slate-500 hover:text-slate-200" />
              </button>
            </div>

            {rightPanelTab === "chat" && <ChatPanel />}
            {rightPanelTab === "lineage" && <LineageSidebar />}
          </aside>
        ) : (
          <button
            className="fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-xl bg-amber-500 px-3 py-4 text-black"
            onClick={() => setRightPanelOpen(true)}
          >
            <ArrowBigLeftDash size={15} />
          </button>
        )}
      </div>

      <MilestoneModal />

      <footer className="h-7 shrink-0 border-t border-white/10 bg-[#080d12] px-4 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Workspace Ready
          </span>
          <span>{workspaceData.papers.length + workspaceData.uploads.length + workspaceData.docs.length} Files</span>
          {activePaperGlow && <span className="text-amber-300">Active paper previewing</span>}
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-red-300">{error}</span>}
          <Sparkles size={12} />
          <span>Tagore OS V2</span>
        </div>
      </footer>
    </div>
  );
};

export default ProjectWorkspace;
