import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FileText, FileJson, X,
  Settings, MessageSquare, Share2, Plus,
  PenTool, LayoutGrid, Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const ProjectWorkspace = () => {
  const location = useLocation();
  // Get papers passed from the search screen (or default to empty if visited directly)
  const initialPapers = location.state?.selectedPapers || [];

  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const fetchedOnce = useRef(false);

  /* FETCHING SINGLE PAPER */
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchPaper = async () => {
      try {
        setFiles([]);
        const toastId = toast.loading("Loading papers!");

        const fetched = [];

        for (let index = 0; index < initialPapers.length; index++) {
          const raw = initialPapers[index];
          const articleId = typeof raw === "string" ? raw : raw?.id;
          if (!articleId) continue;

          const res = await axiosInstance.post("/article/getSinglePaper", { articleId });
          const data = res.data;

          const rawUrl = data?.bibjson?.link?.[0]?.url || "";

        fetched.push({
            id: String(data?.id || articleId),
            type: "pdf",
            title: data?.bibjson?.title || "Untitled Paper",
            authors: data?.bibjson?.author?.map(a => a.name).join(", ") || "",
            venue: data?.bibjson?.journal?.title || "",
            year: data?.bibjson?.year || "",
            abstract: data?.bibjson?.abstract || "No abstract available",
            rawUrl,
            pdfUrl: rawUrl.endsWith(".pdf") ? rawUrl : ""
        });

        }

        fetched.push({
          id: "note-1",
          title: "Research Notes.md",
          type: "note",
          content: "# My Analysis\n\nStart writing here..."
        });

        setFiles(fetched);
        setActiveTab(fetched[0]?.id || "note-1");

        toast.dismiss(toastId);
      } catch (error) {
        toast.error("Unable to fetch papers!");
        console.log("Error in Project Workspace", error);
      }
    };

    if (initialPapers.length > 0) fetchPaper();
  }, [initialPapers]);

  useEffect(() => {
    if (files.length > 0 && !activeTab) {
      setActiveTab(files[0]?.id || "note-1");
    }
  }, [files, activeTab]);

  const activeFile = files.find(f => f?.id === activeTab);
  const closeTab = (fileId)=>{
    const closingFile = files.find(f=>f.id===fileId);
    if(!closingFile) return;

    const updatedFiles = files.filter(f=>f.id!==fileId);
    setFiles(updatedFiles);

    if(activeTab === fileId){
        const nextFile = updatedFiles[0];
        setActiveTab(nextFile ? nextFile.id: null);
    }

  }
  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden" id="project-workspace-root">

      {/* --- TOP HEADER --- */}
      <header className="h-12 border-b border-[#30363d] flex items-center justify-between px-4 bg-[#161b22] shrink-0" id="workspace-header">
        <div className="flex items-center gap-4" id="workspace-header-left">
          <Link to="/workspace" className="text-[#8b949e] hover:text-white" id="workspace-home-link">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center font-serif text-[10px] text-white font-bold" id="workspace-logo">
              T
            </div>
          </Link>
          <span className="text-sm font-medium" id="workspace-title">Untitled Research Project</span>
        </div>

        <div className="flex items-center gap-3" id="workspace-header-right">
          <button className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#267af5] text-white text-xs font-medium rounded-md flex items-center gap-2" id="workspace-share-btn">
            <Share2 size={14} />
            <span>Share</span>
          </button>
          <Settings size={18} className="text-[#8b949e] cursor-pointer hover:text-white" id="workspace-settings-icon" />
          <div className="w-8 h-8 rounded-full bg-gray-700 ml-2" id="workspace-avatar"></div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden" id="workspace-layout">

        {/* 1. LEFT SIDEBAR (EXPLORER) */}
        <aside className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col" id="workspace-explorer">
          <div className="p-3 text-xs font-bold text-[#8b949e] uppercase tracking-wider flex justify-between items-center" id="workspace-explorer-header">
            <span>Explorer</span>
          </div>

          <div className="flex-1 overflow-y-auto" id="workspace-explorer-body">
            <div className="px-2 py-1" id="workspace-explorer-project">
              <div className="flex items-center gap-1 text-sm text-white font-medium mb-1 cursor-pointer" id="workspace-explorer-title">
                <span>Project Files</span>
              </div>

              <div className="pl-4 space-y-0.5" id="workspace-explorer-files">
                {/* List Files */}
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setActiveTab(file.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm ${activeTab === file.id
                      ? 'bg-[#1f6feb]/20 text-white'
                      : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'
                      }`}
                    id={`explorer-file-${file.id}`}
                  >
                    {file.type === 'pdf'
                      ? <FileText size={14} className="text-[#e36209]" id={`explorer-file-icon-pdf-${file.id}`} />
                      : <FileJson size={14} className="text-[#1f6feb]" id={`explorer-file-icon-note-${file.id}`} />
                    }
                    <span className="truncate" id={`explorer-file-title-${file.id}`}>{file.title}</span>
                  </div>
                ))}

                {/* Add New Button */}
                <div className="mt-2 flex items-center gap-2 px-2 py-1 text-xs text-[#8b949e] hover:text-white cursor-pointer" id="workspace-new-note">
                  <Plus size={14} />
                  <span>New Note</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 2. CENTER STAGE (VIEWER) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#161b22]" id="workspace-main">

          {/* Tabs Bar */}
          <div className="h-9 flex items-center bg-[#0d1117] border-b border-[#30363d] overflow-x-auto custom-scrollbar" id="workspace-tabs">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveTab(file.id)}
                className={`group h-full flex items-center gap-2 px-3 min-w-30 max-w-50 border-r border-[#30363d] cursor-pointer select-none text-xs ${activeTab === file.id
                  ? 'bg-[#161b22] text-white border-t-2 border-t-[#1f6feb]'
                  : 'bg-[#0d1117] text-[#8b949e] hover:bg-[#161b22]'
                  }`}
                id={`tab-${file.id}`}
              >
                {file.type === 'pdf'
                  ? <FileText size={12} className={activeTab === file.id ? "text-[#e36209]" : ""} id={`tab-icon-pdf-${file.id}`} />
                  : <FileJson size={12} className={activeTab === file.id ? "text-[#1f6feb]" : ""} id={`tab-icon-note-${file.id}`} />
                }
                <span className="truncate flex-1" id={`tab-title-${file.id}`}>{file.title}</span>
                <X size={12} className="opacity-0 group-hover:opacity-100 hover:text-white" id={`tab-close-${file.id}`}
                onClick={(e)=>{
                    e.stopPropagation();
                    closeTab(file.id);
                }} />
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 relative overflow-hidden" id="workspace-content">

            {files
                .filter(f => f.type === "pdf")
                .map((file) => (
                <div
                    key={file.id}
                    id={`pdf-container-${file.id}`}
                    className={`absolute inset-0 ${activeTab === file.id ? "block" : "hidden"}`}
                    >
                    {file.pdfUrl ? (
                    <iframe
                        id={`pdf-iframe-${file.id}`}
                        title={file.title}
                        src={file.pdfUrl}
                        className="w-full h-full border-0"
                    />
                    ) : (
                    <div className="p-6 text-sm text-[#8b949e] h-full flex flex-col items-center justify-center text-center gap-4">
                        <p>This paper cannot be embedded as PDF.</p>

                        <a
                            href={file.rawUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1f6feb] underline"
                        >
                            Open paper in new tab
                        </a>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                            Upload the paper
                        </button>
                    </div>

                    )}
                </div>
                ))}

            {/* Note view */}
            {activeFile?.type === "note" && (
                <div className="h-full w-full p-8 bg-[#0d1117] overflow-y-auto" id="note-editor">
                ...
                </div>
            )}
            </div>

        </main>

        {/* 3. RIGHT SIDEBAR (TOOLS) */}
        {rightPanelOpen && (
          <aside className="w-80 bg-[#0d1117] border-l border-[#30363d] flex flex-col" id="workspace-right-panel">
            <div className="h-9 border-b border-[#30363d] flex items-center px-2 bg-[#161b22]" id="workspace-right-panel-header">
              <div className="flex-1 flex gap-1" id="workspace-right-panel-tabs">
                <button className="px-3 py-1 text-xs font-medium text-white border-b-2 border-[#1f6feb]" id="right-tab-graph">Graph</button>
                <button className="px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-white" id="right-tab-chat">Chat</button>
                <button className="px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-white" id="right-tab-citations">Citations</button>
              </div>
              <button onClick={() => setRightPanelOpen(false)} id="right-panel-close-btn">
                <X size={14} className="text-[#8b949e]" />
              </button>
            </div>

            <div className="flex-1 p-4 relative overflow-hidden" id="workspace-right-panel-body">
              <div className="relative z-10 text-center mt-60" id="workspace-right-panel-graph-info">
                <h3 className="text-sm font-semibold text-[#c9d1d9]" id="graph-title">Knowledge Graph</h3>
                <p className="text-xs text-[#8b949e] mt-1" id="graph-desc">
                  Visualizing connections between {Math.max(0, files.filter(f => f.type === "pdf").length)} papers.
                </p>
              </div>
            </div>

            <div className="p-3 border-t border-[#30363d] bg-[#161b22]" id="workspace-chat-input-wrap">
              <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2" id="workspace-chat-input">
                <MessageSquare size={14} className="text-[#8b949e]" id="workspace-chat-icon" />
                <input
                  id="workspace-chat-text"
                  type="text"
                  placeholder="Ask AI about these papers..."
                  className="bg-transparent text-xs text-white w-full outline-none"
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Footer Status Bar */}
      <footer className="h-6 bg-[#1f6feb] text-white text-[10px] flex items-center px-3 justify-between" id="workspace-footer">
        <div className="flex gap-4" id="workspace-footer-left">
          <span className="flex items-center gap-1" id="workspace-status">
            <LayoutGrid size={10} /> Workspace Ready
          </span>
          <span id="workspace-file-count">{files.length} Files</span>
        </div>
        <div className="flex gap-4" id="workspace-footer-right">
          <span id="workspace-position">Ln 1, Col 1</span>
          <span id="workspace-encoding">UTF-8</span>
          <span className="flex items-center gap-1" id="workspace-fullscreen">
            <Maximize2 size={10} /> Full Screen
          </span>
        </div>
      </footer>

    </div>
  );
};

export default ProjectWorkspace;
