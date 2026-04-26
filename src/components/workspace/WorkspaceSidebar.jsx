import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Database,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Folder,
  Plus,
  Search,
  Sigma,
  Type,
  Upload,
} from "lucide-react";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

const uploadIcon = {
  image: FileImage,
  pdf: FileText,
  doc: File,
  sheet: FileSpreadsheet,
  file: File,
};

const docOptions = [
  { type: "text", label: "Text", icon: Type },
  { type: "latex", label: "LaTeX", icon: Sigma },
  { type: "docx", label: "DOCX", icon: FileText },
  { type: "sheet", label: "Sheet", icon: Database },
];

const SidebarRow = ({ active, icon: Icon, title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group w-full text-left flex items-start gap-2 rounded-xl px-3 py-2 border-l-2 transition-all
      ${active
        ? "border-yellow-500 bg-yellow-500/10 text-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
      }`}
  >
    {React.createElement(Icon, {
      size: 15,
      className: `mt-0.5 shrink-0 ${active ? "text-yellow-400" : "text-slate-500 group-hover:text-slate-300"}`,
    })}
    <span className="min-w-0">
      <span className="block truncate text-xs font-semibold">{title}</span>
      {subtitle && <span className="block truncate text-[10px] text-slate-500 mt-0.5">{subtitle}</span>}
    </span>
  </button>
);

const WorkspaceSidebar = () => {
  const navigate = useNavigate();
  const projectId = useWorkspaceStore((state) => state.projectId);
  const activeTabId = useWorkspaceStore((state) => state.activeTabId);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const openTab = useWorkspaceStore((state) => state.openTab);
  const uploadFile = useWorkspaceStore((state) => state.uploadFile);
  const createDoc = useWorkspaceStore((state) => state.createDoc);
  const addPaperFromUrl = useWorkspaceStore((state) => state.addPaperFromUrl);
  const isUploading = useWorkspaceStore((state) => state.isUploading);

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [uploadsOpen, setUploadsOpen] = useState(true);
  const [papersOpen, setPapersOpen] = useState(true);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [paperInputOpen, setPaperInputOpen] = useState(false);
  const [paperQuery, setPaperQuery] = useState("");

  const handleUpload = async (event) => {
    const files = event.target.files;
    await uploadFile(projectId, files);
    event.target.value = "";
    setAddMenuOpen(false);
  };

  const handleAddPaperSubmit = async (event) => {
    event.preventDefault();
    const value = paperQuery.trim();
    if (!value) return;

    const isUrl = /^https?:\/\//i.test(value);
    if (isUrl) {
      const paper = await addPaperFromUrl(value);
      if (paper) {
        setPaperInputOpen(false);
        setPaperQuery("");
      }
      return;
    }

    navigate("/workspace", {
      state: {
        initialQuery: value,
        addToProjectId: projectId,
        existingPapers: workspaceData.papers,
      },
    });
  };

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 bg-[#080d12] text-slate-200 flex flex-col">
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Project</p>
        <h2 className="text-sm font-semibold mt-2 leading-snug">Research Workspace</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <section>
          <div className="relative">
            <div className="flex items-center justify-between px-2 mb-2">
              <button
                type="button"
                onClick={() => setPapersOpen((value) => !value)}
                className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 hover:text-slate-300"
              >
                {papersOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                Active Papers
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaperInputOpen((value) => !value)}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-amber-300"
                >
                  <Plus size={13} />
                  Add Paper
                </button>
                <span className="text-[10px] text-slate-500">{workspaceData.papers.length}</span>
              </div>
            </div>

          </div>

          {papersOpen && (
            <div className="space-y-1">
              {workspaceData.papers.length === 0 ? (
                <p className="px-3 py-3 text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
                  No papers selected yet.
                </p>
              ) : (
                workspaceData.papers.map((paper) => (
                  <SidebarRow
                    key={paper.id}
                    active={activeTabId === paper.id}
                    icon={FileText}
                    title={paper.title}
                    subtitle={[paper.venue, paper.year].filter(Boolean).join(", ")}
                    onClick={() => openTab(paper)}
                  />
                ))
              )}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between px-2 mb-2">
            <button
              type="button"
              onClick={() => setUploadsOpen((value) => !value)}
              className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 hover:text-slate-300"
            >
              {uploadsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              Uploaded
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAddMenuOpen((value) => !value)}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
              >
                <Plus size={13} />
                Add
              </button>

              {addMenuOpen && (
                <div className="absolute right-0 top-6 z-20 w-32 rounded-xl border border-white/10 bg-[#111922] p-1 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10"
                  >
                    <Upload size={13} />
                    Files
                  </button>
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10"
                  >
                    <Folder size={13} />
                    Folder
                  </button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/*,.doc,.docx,.csv,.xls,.xlsx"
              className="hidden"
              onChange={handleUpload}
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              webkitdirectory=""
              directory=""
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {uploadsOpen && (
            <div className="space-y-1">
              {isUploading && <p className="px-3 py-2 text-xs text-amber-300">Uploading...</p>}
              {workspaceData.uploads.length === 0 ? (
                <p className="px-3 py-3 text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
                  Upload PDFs, images, docs, datasets, or folders.
                </p>
              ) : (
                workspaceData.uploads.map((file) => {
                  const Icon = uploadIcon[file.type] || File;
                  return (
                    <SidebarRow
                      key={file.id}
                      active={activeTabId === file.id}
                      icon={Icon}
                      title={file.title}
                      subtitle={file.folderPath || file.type}
                      onClick={() => openTab(file)}
                    />
                  );
                })
              )}
            </div>
          )}
        </section>
      </div>

      {paperInputOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 backdrop-blur-[7px]">
          <button
            type="button"
            aria-label="Close add paper search"
            className="absolute inset-0 cursor-default"
            onClick={() => setPaperInputOpen(false)}
          />
          <form
            onSubmit={handleAddPaperSubmit}
            className="relative z-10 w-[min(680px,calc(100vw-48px))]"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-[#080d12]/95 px-4 py-2.5 shadow-[0_18px_60px_rgba(0,0,0,0.65),0_0_0_1px_rgba(245,158,11,0.08)]">
              <Search size={18} className="text-slate-500" />
              <input
                autoFocus
                value={paperQuery}
                onChange={(event) => setPaperQuery(event.target.value)}
                placeholder="enter the name/ url of the paper"
                className="h-8 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="grid h-8 w-8 place-items-center rounded-full bg-[#4f9dff] text-white shadow-[0_0_22px_rgba(79,157,255,0.45)] transition hover:scale-105"
              >
                <ArrowUp size={16} strokeWidth={3} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative p-3 border-t border-white/10">
        {newMenuOpen && (
          <div className="absolute left-3 right-3 bottom-16 rounded-2xl border border-white/10 bg-[#111922] p-2 shadow-2xl">
            {docOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  type="button"
                  key={option.type}
                  onClick={() => {
                    createDoc(option.type);
                    setNewMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <Icon size={15} />
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setNewMenuOpen((value) => !value)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/70 px-4 py-2.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/10"
        >
          <Plus size={16} />
          New
        </button>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
