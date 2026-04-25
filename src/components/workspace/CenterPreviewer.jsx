import React from "react";
import { FileText, Image, Table2, X } from "lucide-react";
import ScribeEditor from "../lineage/ScribeEditor";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

const getPreviewUrl = (tab) => tab?.pdfUrl || tab?.url || tab?.rawUrl || "";

const EmptyState = () => (
  <div className="h-full flex items-center justify-center bg-[#0b1118]">
    <div className="text-center max-w-sm px-6">
      <div className="w-16 h-16 mx-auto rounded-2xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
        T
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">Select a file to begin synthesis.</h3>
      <p className="mt-2 text-sm text-slate-500">
        Open a paper, upload, or authored document from the explorer.
      </p>
    </div>
  </div>
);

const UnsupportedPreview = ({ tab }) => (
  <div className="h-full flex items-center justify-center bg-[#0b1118] text-center px-8">
    <div>
      <FileText size={34} className="mx-auto text-slate-500" />
      <h3 className="mt-4 text-sm font-semibold text-white">{tab.title}</h3>
      <p className="mt-2 text-xs text-slate-500">Preview is not available for this file type yet.</p>
      {tab.url && (
        <a
          href={tab.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex mt-4 rounded-lg border border-amber-500/60 px-4 py-2 text-xs text-amber-400 hover:bg-amber-500/10"
        >
          Open file
        </a>
      )}
    </div>
  </div>
);

const Renderer = ({ tab }) => {
  if (!tab) return <EmptyState />;

  if (tab.type === "text" || tab.type === "latex") {
    return <ScribeEditor />;
  }

  if (tab.type === "sheet") {
    return (
      <div className="h-full flex items-center justify-center bg-[#0b1118]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-8 text-center">
          <Table2 size={34} className="mx-auto text-emerald-400" />
          <h3 className="mt-4 text-sm font-semibold text-white">Data Grid Loading...</h3>
          <p className="mt-2 text-xs text-slate-500">Sheet preview shell is ready for the grid engine.</p>
        </div>
      </div>
    );
  }

  if (tab.type === "image") {
    return (
      <div className="h-full overflow-auto bg-[#0b1118] p-8 flex items-center justify-center">
        <img src={tab.url} alt={tab.title} className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10" />
      </div>
    );
  }

  if (tab.type === "paper" || tab.type === "pdf") {
    const url = getPreviewUrl(tab);

    if (!url) {
      return (
        <div className="h-full flex items-center justify-center bg-[#0b1118] text-center px-8">
          <div>
            <FileText size={34} className="mx-auto text-amber-400" />
            <h3 className="mt-4 text-sm font-semibold text-white">{tab.title}</h3>
            <p className="mt-2 text-xs text-slate-500">
              This paper did not provide an embeddable PDF URL.
            </p>
          </div>
        </div>
      );
    }

    return <iframe title={tab.title} src={url} className="w-full h-full border-0 bg-white" />;
  }

  return <UnsupportedPreview tab={tab} />;
};

const CenterPreviewer = () => {
  const activeTabId = useWorkspaceStore((state) => state.activeTabId);
  const openTabs = useWorkspaceStore((state) => state.openTabs);
  const setActiveTab = useWorkspaceStore((state) => state.setActiveTab);
  const closeTab = useWorkspaceStore((state) => state.closeTab);
  const activeTab = openTabs.find((tab) => tab.id === activeTabId);

  return (
    <main className="flex-1 min-w-0 bg-[#0b1118] flex flex-col">
      <div className="h-11 shrink-0 flex items-center border-b border-white/10 bg-[#090e14] overflow-x-auto">
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const Icon = tab.type === "image" ? Image : tab.type === "sheet" ? Table2 : FileText;

          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group h-full min-w-36 max-w-56 px-3 flex items-center gap-2 border-r border-white/10 border-t-2 text-xs
                ${isActive
                  ? "border-t-amber-500 bg-[#101821] text-white"
                  : "border-t-transparent text-slate-500 hover:bg-white/[0.03] hover:text-slate-200"
                }`}
            >
              <Icon size={14} className={isActive ? "text-amber-400" : "text-slate-600"} />
              <span className="truncate flex-1 text-left">{tab.title}</span>
              {tab.id !== "manuscript" && (
                <X
                  size={13}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-300"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(tab.id);
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <Renderer tab={activeTab} />
      </div>
    </main>
  );
};

export default CenterPreviewer;
