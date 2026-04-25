import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import ChatPanel from '../components/layout/ChatPanel.jsx';
import ScribeEditor from '../components/lineage/ScribeEditor.jsx';
import MilestoneModal from '../components/lineage/MilestoneModal.jsx';
import LineageSidebar from '../components/lineage/LineageSidebar.jsx';
import { useEditorStore } from '../store/useEditorStore.js';
import { useWorkspaceStore } from '../store/useWorkspaceStore.js';
// pdf-parse is a Node.js-only library — PDF text extraction runs server-side via the LLM route.

import {
  FileText, FileJson, X,
  Settings, Share2, Plus,
  LayoutGrid, ArrowBigLeftDash,
} from 'lucide-react';

const areFilesEqualById = (a = [], b = []) =>
  a.length === b.length && a.every((file, index) => file.id === b[index]?.id);

const ProjectWorkspace = () => {
  const location     = useLocation();
  const navigate     = useNavigate();
  const { projectId: routeProjectId } = useParams();
  const projectId    = routeProjectId || location.state?.projectId || null;
  const initialPapers = location.state?.selectedPapers || [];

  // ── Local UI state ──────────────────────────────────────────────────────
  const [files, setFiles]             = useState([]);
  const [activeTab, setActiveTab]     = useState(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab]   = useState("lineage");
  const [projtitle, setProjTitle]     = useState("");
  const [allText, setAllText]         = useState("");

  // isInitialized gates the rehydration effect so it never fires before
  // the initial paper-fetch has populated knownPdfFiles.current
  const [isInitialized, setIsInitialized] = useState(false);

  // ── Store hooks (individual selectors → stable references, no full-store re-render) ──
  // useEditorStore has persist middleware; only select setContent (never activePapers setter —
  // that triggered forceStoreRerender → infinite loop).
  const setContent               = useEditorStore(s => s.setContent);
  const workspaceActivePapers    = useWorkspaceStore(s => s.activePapers);
  const fetchWorkspace           = useWorkspaceStore(s => s.fetchWorkspace);
  const setProjectId             = useWorkspaceStore(s => s.setProjectId);
  const setWorkspaceActivePapers = useWorkspaceStore(s => s.setActivePapers);
  const createWorkspaceProject   = useWorkspaceStore(s => s.createWorkspaceProject);

  // ── Refs ────────────────────────────────────────────────────────────────
  const fetchedOnce           = useRef(false);
  const createdProjectOnce    = useRef(false);
  const knownPdfFiles         = useRef([]);   // full file objects for all PDFs seen this session
  const lastWorkspacePapers   = useRef("[]"); // last serialized activePapers we SET (not received)

  useEffect(() => {
    if (projectId || createdProjectOnce.current) return;
    createdProjectOnce.current = true;

    createWorkspaceProject({ title: projtitle }).then((createdProjectId) => {
      if (!createdProjectId) return;
      navigate(`/workspace/ide/${createdProjectId}`, {
        replace: true,
        state: {
          ...location.state,
          projectId: createdProjectId,
        },
      });
    });
  }, [projectId, createWorkspaceProject, navigate, location.state, projtitle]);

  // ── Load backend workspace on mount (if projectId present) ──────────────
  useEffect(() => {
    if (!projectId) return;
    setProjectId(projectId);
    fetchWorkspace(projectId).then((project) => {
      if (!project) return;
      // fetchWorkspace already hydrates useWorkspaceStore.activePapers via hydrateFromProject.
      // Only mirror the manuscript into useEditorStore so ScribeEditor rehydrates Tiptap.
      if (project.currentManuscript) setContent(project.currentManuscript);
    });
  }, [projectId, fetchWorkspace, setProjectId, setContent]);

  // ── Sync open PDF tabs → useWorkspaceStore (only after initialization) ──
  useEffect(() => {
    if (!isInitialized) return;
    const ids        = files.filter(f => f.type === "pdf").map(f => f.id);
    const serialized = JSON.stringify(ids);
    if (serialized === lastWorkspacePapers.current) return;
    lastWorkspacePapers.current = serialized;
    setWorkspaceActivePapers(ids);
  }, [files, isInitialized, setWorkspaceActivePapers]);

  // ── React to milestone rehydration (workspaceActivePapers changed externally) ──
  useEffect(() => {
    if (!isInitialized) return; // never fires before knownPdfFiles is populated
    const serialized = JSON.stringify(workspaceActivePapers);
    if (serialized === lastWorkspacePapers.current) return; // we set this ourselves — skip
    lastWorkspacePapers.current = serialized;

    setFiles(prev => {
      const noteFiles     = prev.filter(f => f.type !== "pdf");
      const restoredPdfs  = knownPdfFiles.current.filter(f =>
        workspaceActivePapers.includes(f.id)
      );
      const nextFiles = [...restoredPdfs, ...noteFiles];
      return areFilesEqualById(prev, nextFiles) ? prev : nextFiles;
    });

    setActiveTab(prev => {
      const nextActiveTab = workspaceActivePapers.includes(prev)
        ? prev
        : workspaceActivePapers[0] ?? "note-1";
      return prev === nextActiveTab ? prev : nextActiveTab;
    });
  }, [workspaceActivePapers, isInitialized]);

  // ── Initial paper fetch ─────────────────────────────────────────────────
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchPaper = async () => {
      try {
        setFiles([]);
        const toastId = toast.loading("Loading papers!");
        const fetched = [];

        for (const raw of initialPapers) {
          const articleId = typeof raw === "string" ? raw : raw?.id;
          if (!articleId) continue;

          const res  = await axiosInstance.post("/article/getSinglePaper", { articleId });
          const data = res.data;
          const rawUrl = data?.bibjson?.link?.[0]?.url || "";

          fetched.push({
            id:       String(data?.id || articleId),
            type:     "pdf",
            title:    data?.bibjson?.title || "Untitled Paper",
            authors:  data?.bibjson?.author?.map(a => a.name).join(", ") || "",
            venue:    data?.bibjson?.journal?.title || "",
            year:     data?.bibjson?.year || "",
            abstract: data?.bibjson?.abstract || "No abstract available",
            rawUrl,
            pdfUrl:   rawUrl.endsWith(".pdf") ? rawUrl : "",
          });
        }

        fetched.push({ id: "note-1", title: "Research Notes", type: "note", content: "..." });

        knownPdfFiles.current = fetched.filter(f => f.type === "pdf");
        setFiles(fetched);
        setActiveTab(fetched[0]?.id || "note-1");
        toast.dismiss(toastId);
      } catch (err) {
        toast.error("Unable to fetch papers!");
        console.error("Error in ProjectWorkspace fetch:", err);
      } finally {
        setIsInitialized(true); // ← gate opens AFTER files are ready
      }
    };

    if (initialPapers.length > 0) {
      fetchPaper();
    } else {
      setFiles([{ id: "note-1", title: "Research Notes", type: "note", content: "..." }]);
      setActiveTab("note-1");
      setIsInitialized(true); // ← gate opens immediately when no papers to fetch
    }
  }, []); // intentionally empty — runs once on mount

  // ── Fallback: ensure a tab is always active ─────────────────────────────
  useEffect(() => {
    if (files.length > 0 && !activeTab) {
      setActiveTab(files[0]?.id || "note-1");
    }
  }, [files, activeTab]);

  // ── PDF text extraction (server-side via LLM route) ────────────────────
  const workPDF = async (url) => {
    try {
      await fetch("http://localhost:1601/api/llm/send-page", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url }),
      });
    } catch {
      // Non-fatal — workspace still functions without LLM text extraction
    }
  };

  const uploadPaper = async (e, paperId) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.type !== "application/pdf") { toast.error("Upload PDF file only!"); return; }

      const toastId = toast.loading("Uploading PDF...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tagore_pdf");
      formData.append("folder", "Tagore_Cloud");

      const res  = await fetch("https://api.cloudinary.com/v1_1/dvbbmbius/raw/upload", {
        method: "POST", body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(toastId);
        toast.error(data?.error?.message || "Upload failed");
        return;
      }

      const url = data.secure_url + "?response-content-disposition=inline";
      workPDF(url);

      setFiles(prev => prev.map(f => {
        if (f.id !== paperId) return f;
        const updated = { ...f, pdfUrl: url, rawUrl: url };
        knownPdfFiles.current = knownPdfFiles.current.map(kf =>
          kf.id === paperId ? updated : kf
        );
        return updated;
      }));

      toast.dismiss(toastId);
      toast.success("PDF uploaded!");
    } catch {
      toast.error("Upload failed!");
    }
  };

  // ── Download helpers ────────────────────────────────────────────────────
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: filename || "untitled" });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // ── Tab management ──────────────────────────────────────────────────────
  const closeTab = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    if (activeTab === fileId) setActiveTab(updatedFiles[0]?.id ?? null);
  };

  const addNewNote = () => {
    const noteCount = files.filter(f => f.type === "note").length;
    const id   = `note-${Date.now()}`;
    const note = { id, title: `Research Notes ${noteCount + 1}`, type: "note", content: "..." };
    setFiles(prev => [...prev, note]);
    setActiveTab(id);
  };

  const activeFile = files.find(f => f?.id === activeTab);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden"
      id="project-workspace-root"
    >
      {/* TOP HEADER */}
      <header
        className="h-12 border-b border-[#30363d] flex items-center justify-between px-4 bg-[#161b22] shrink-0"
        id="workspace-header"
      >
        <div className="flex items-center gap-4">
          <Link to="/workspace" className="text-[#8b949e] hover:text-white">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center font-serif text-[10px] text-white font-bold">
              T
            </div>
          </Link>
          <input
            className="text-sm font-medium bg-transparent outline-none placeholder:text-[#8b949e]"
            onChange={e => setProjTitle(e.target.value)}
            placeholder="Untitled Research Project"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#267af5] text-white text-xs font-medium rounded-md flex items-center gap-2">
            <Share2 size={14} /><span>Share</span>
          </button>
          <Settings size={18} className="text-[#8b949e] cursor-pointer hover:text-white" />
          <div className="w-8 h-8 rounded-full bg-gray-700 ml-2" />
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden" id="workspace-layout">

        {/* LEFT SIDEBAR — EXPLORER */}
        <aside className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col" id="workspace-explorer">
          <div className="p-3 text-xs font-bold text-[#8b949e] uppercase tracking-wider">
            Explorer
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 py-1">
              <div className="text-sm text-white font-medium mb-1 px-1">Project Files</div>
              <div className="pl-4 space-y-0.5">
                {files.map(file => (
                  <div
                    key={file.id}
                    onClick={() => setActiveTab(file.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm
                      ${activeTab === file.id
                        ? "bg-[#1f6feb]/20 text-white"
                        : "text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]"
                      }`}
                  >
                    {file.type === "pdf"
                      ? <FileText size={14} className="text-[#e36209]" />
                      : <FileJson size={14} className="text-[#1f6feb]" />
                    }
                    <span className="truncate">{file.title}</span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addNewNote}
                  className="mt-2 flex items-center gap-2 px-2 py-1 text-xs text-[#8b949e] hover:text-white cursor-pointer w-full"
                >
                  <Plus size={14} /><span>New Note</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER — VIEWER */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#161b22]" id="workspace-main">

          {/* Tab bar */}
          <div className="h-9 flex items-center bg-[#0d1117] border-b border-[#30363d] overflow-x-auto">
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => setActiveTab(file.id)}
                className={`group h-full flex items-center gap-2 px-3 min-w-[7.5rem] max-w-[12.5rem] border-r border-[#30363d] cursor-pointer select-none text-xs
                  ${activeTab === file.id
                    ? "bg-[#161b22] text-white border-t-2 border-t-[#1f6feb]"
                    : "bg-[#0d1117] text-[#8b949e] hover:bg-[#161b22]"
                  }`}
              >
                {file.type === "pdf"
                  ? <FileText size={12} className={activeTab === file.id ? "text-[#e36209]" : ""} />
                  : <FileJson size={12} className={activeTab === file.id ? "text-[#1f6feb]" : ""} />
                }
                <span className="truncate flex-1">{file.title}</span>
                <X
                  size={12}
                  className="opacity-0 group-hover:opacity-100 hover:text-white shrink-0"
                  onClick={e => { e.stopPropagation(); closeTab(file.id); }}
                />
              </div>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 relative overflow-hidden">
            {/* PDF iframes — all rendered, toggled via display */}
            {files.filter(f => f.type === "pdf").map(file => (
              <div
                key={file.id}
                className={`absolute inset-0 ${activeTab === file.id ? "block" : "hidden"}`}
              >
                {file.pdfUrl ? (
                  <iframe title={file.title} src={file.pdfUrl} className="w-full h-full border-0" />
                ) : (
                  <div className="p-6 text-sm text-[#8b949e] h-full flex flex-col items-center justify-center text-center gap-4">
                    <p>This paper cannot be embedded. Download and re-upload as PDF.</p>
                    <a href={file.rawUrl} target="_blank" rel="noreferrer" className="text-[#1f6feb] underline">
                      Open in new tab
                    </a>
                    <label>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={e => uploadPaper(e, file.id)}
                      />
                      <span className="px-4 py-2 rounded-md bg-[#1f6feb] hover:bg-[#267af5] text-white text-xs font-medium cursor-pointer transition block">
                        Upload PDF
                      </span>
                    </label>
                  </div>
                )}
              </div>
            ))}

            {/* Note view — ScribeEditor (shared across all note tabs) */}
            {activeFile?.type === "note" && (
              <div className="h-full w-full overflow-y-auto">
                <ScribeEditor />
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        {rightPanelOpen ? (
          <div className="w-80 flex flex-col min-h-0 shrink-0">
            <div className="h-9 border-b border-[#30363d] flex items-center px-2 bg-[#161b22]">
              <div className="flex-1 flex gap-1">
                {["chat", "lineage"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setRightPanelTab(tab)}
                    className={`px-3 py-1 text-xs font-medium capitalize transition-all
                      ${rightPanelTab === tab
                        ? "text-white border-b-2 border-[#1f6feb]"
                        : "text-[#8b949e] hover:text-white"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button onClick={() => setRightPanelOpen(false)}>
                <X size={14} className="text-[#8b949e]" />
              </button>
            </div>

            {rightPanelTab === "chat"    && <ChatPanel />}
            {rightPanelTab === "lineage" && <LineageSidebar />}
          </div>
        ) : (
          <button
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md"
            onClick={() => setRightPanelOpen(true)}
          >
            <ArrowBigLeftDash size={14} />
          </button>
        )}
      </div>

      {/* Milestone capture modal — always mounted, hidden when closed */}
      <MilestoneModal />

      {/* Footer status bar */}
      <footer className="h-6 bg-[#1f6feb] text-white text-[10px] flex items-center px-3 justify-between">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <LayoutGrid size={10} /> Workspace Ready
          </span>
          <span>{files.length} Files</span>
        </div>
      </footer>
    </div>
  );
};

export default ProjectWorkspace;
