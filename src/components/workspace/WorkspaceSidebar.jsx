import React, { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Database,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Folder,
  Plus,
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
  const projectId = useWorkspaceStore((state) => state.projectId);
  const activeTabId = useWorkspaceStore((state) => state.activeTabId);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const openTab = useWorkspaceStore((state) => state.openTab);
  const uploadFile = useWorkspaceStore((state) => state.uploadFile);
  const createDoc = useWorkspaceStore((state) => state.createDoc);
  const isUploading = useWorkspaceStore((state) => state.isUploading);

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [uploadsOpen, setUploadsOpen] = useState(true);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const handleUpload = async (event) => {
    const files = event.target.files;
    await uploadFile(projectId, files);
    event.target.value = "";
    setAddMenuOpen(false);
  };

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 bg-[#080d12] text-slate-200 flex flex-col">
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Project</p>
        <h2 className="text-sm font-semibold mt-2 leading-snug">Research Workspace</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <section>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Active Papers</p>
            <span className="text-[10px] text-slate-500">{workspaceData.papers.length}</span>
          </div>

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
