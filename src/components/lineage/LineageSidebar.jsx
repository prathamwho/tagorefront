import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Clock, GitCommitVertical, RefreshCcw, RotateCcw } from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import { useLineageStore } from "../../store/useLineageStore";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

const getMilestoneId = (milestone) => milestone?._id || milestone?.id;

const formatTimestamp = (iso) => {
  if (!iso) return "Unsealed";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " - " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
};

const ConfirmDialog = ({ milestone, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div
      className="w-full max-w-sm mx-4 bg-(--surface-primary) border border-(--border-subtle) rounded-2xl shadow-2xl p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-sm font-semibold text-(--text-primary) font-satoshi mb-1">
        Discard unsaved changes?
      </h3>
      <p className="text-xs text-(--text-muted) font-satoshi leading-relaxed mb-5">
        Restoring <span className="font-medium text-(--text-primary)">"{milestone.title}"</span> will replace the current draft view.
      </p>
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-(--text-muted) border border-(--border-subtle) rounded-lg cursor-pointer hover:bg-(--surface-featured) transition-all duration-300 ease-out font-satoshi"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 text-xs font-semibold bg-(--accent-action) text-white rounded-lg cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-300 ease-out font-satoshi"
        >
          Restore anyway
        </button>
      </div>
    </div>
  </div>
);

const LineageSidebar = () => {
  const {
    content,
    setContent,
    presentSnapshot,
    setPresentSnapshot,
    clearPresentSnapshot,
  } = useEditorStore();
  const { activeMilestoneId, setActiveMilestoneId } = useLineageStore();
  const {
    projectId,
    milestones,
    manuscriptContent,
    activePapers,
    fetchMilestones,
    saveStatus,
    error,
    loadManuscriptSnapshot,
    loadActivePapersSnapshot,
  } = useWorkspaceStore();

  const [confirmPending, setConfirmPending] = useState(null);
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetchMilestones(projectId);
  }, [projectId, fetchMilestones]);

  const isDirty = useMemo(() => {
    if (!activeMilestoneId) return false;
    const active = milestones.find((m) => getMilestoneId(m) === activeMilestoneId);
    if (!active) return false;
    return JSON.stringify(content) !== JSON.stringify(active.manuscriptSnapshot);
  }, [content, activeMilestoneId, milestones]);

  const executeRehydrate = (milestone) => {
    if (!presentSnapshot) {
      setPresentSnapshot({
        content: content && Object.keys(content).length ? content : manuscriptContent,
        activePapers,
      });
    }

    const manuscriptSnapshot = milestone.manuscriptSnapshot || {};
    const librarySnapshot = Array.isArray(milestone.librarySnapshot) ? milestone.librarySnapshot : [];

    setContent(manuscriptSnapshot);
    loadManuscriptSnapshot(manuscriptSnapshot);
    loadActivePapersSnapshot(librarySnapshot);
    setActiveMilestoneId(getMilestoneId(milestone));
  };

  const handleRestore = (milestone) => {
    const milestoneId = getMilestoneId(milestone);
    if (milestoneId === activeMilestoneId && !isDirty) return;

    if (saveStatus === "Unsaved changes" || isDirty) {
      setConfirmPending(milestone);
      return;
    }

    executeRehydrate(milestone);
  };

  const handleConfirm = () => {
    if (confirmPending) executeRehydrate(confirmPending);
    setConfirmPending(null);
  };

  const handleBackToPresent = () => {
    if (presentSnapshot) {
      setContent(presentSnapshot.content);
      loadManuscriptSnapshot(presentSnapshot.content);
      loadActivePapersSnapshot(presentSnapshot.activePapers);
    }

    setActiveMilestoneId(null);
    clearPresentSnapshot();
  };

  const handleRefresh = () => {
    if (!projectId) return;
    fetchMilestones(projectId);
  };

  const visibleMilestones = showAllMilestones ? milestones : milestones.slice(0, 3);

  return (
    <>
      {confirmPending && (
        <ConfirmDialog
          milestone={confirmPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmPending(null)}
        />
      )}

      <div className="w-80 h-full flex flex-col bg-(--surface-primary) border-l border-(--border-subtle) overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border-subtle) shrink-0 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-(--text-primary) font-satoshi">
                Lineage
              </h3>
              <p className="text-[10px] text-(--text-muted) mt-0.5 font-satoshi">
                {milestones.length} milestone{milestones.length !== 1 ? "s" : ""} registered
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={!projectId}
              className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--accent-action) hover:bg-(--surface-featured) transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Refresh timeline"
            >
              <RefreshCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeMilestoneId ? (
              <span className="px-2 py-0.5 rounded-full border border-(--accent-action) text-[10px] text-(--accent-action) font-medium font-satoshi">
                Viewing snapshot
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full border border-(--border-subtle) text-[10px] text-(--text-muted) font-medium font-satoshi">
                Present draft
              </span>
            )}
          </div>

          {activeMilestoneId && (
            <button
              type="button"
              onClick={handleBackToPresent}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-(--accent-action) text-(--accent-action) text-xs font-medium cursor-pointer hover:bg-(--surface-featured) transition-all duration-300 ease-out font-satoshi"
            >
              <Clock size={12} />
              Back to Present
            </button>
          )}

          {error && (
            <p className="text-[10px] text-red-500 font-satoshi leading-relaxed">
              {error}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!projectId ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 pb-10">
              <div className="w-10 h-10 rounded-full border-2 border-(--border-subtle) flex items-center justify-center">
                <GitCommitVertical size={16} className="text-(--text-muted)" />
              </div>
              <p className="text-xs text-(--text-muted) font-satoshi leading-relaxed max-w-48">
                Open a backend-backed workspace to begin your lineage.
              </p>
            </div>
          ) : milestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 pb-10">
              <div className="w-10 h-10 rounded-full border-2 border-(--border-subtle) flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-(--border-subtle)" />
              </div>
              <p className="text-xs text-(--text-muted) font-satoshi leading-relaxed max-w-48">
                No milestones registered yet. Begin your lineage.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-(--border-subtle)" />

              <div className="space-y-4">
                {visibleMilestones.map((milestone) => {
                  const milestoneId = getMilestoneId(milestone);
                  const isActive = milestoneId === activeMilestoneId;
                  const nodeSize = milestone.isMajor ? "w-7 h-7" : "w-6 h-6";
                  const dotSize = milestone.isMajor ? "w-2.5 h-2.5" : "w-2 h-2";

                  return (
                    <div key={milestoneId} className="relative flex gap-4">
                      <div className="shrink-0 mt-1.5 z-10">
                        <div
                          className={`${nodeSize} rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-out
                            ${isActive
                              ? "border-(--accent-action) bg-(--accent-action) shadow-sm"
                              : milestone.isMajor
                                ? "border-(--accent-action) bg-(--surface-primary)"
                                : "border-(--border-subtle) bg-(--surface-primary)"
                            }`}
                        >
                          <div
                            className={`${dotSize} rounded-full transition-all duration-300 ease-out
                              ${isActive
                                ? "bg-white"
                                : milestone.isMajor
                                  ? "bg-(--accent-action)"
                                  : "bg-(--border-subtle)"
                              }`}
                          />
                        </div>
                      </div>

                      <div
                        className={`flex-1 p-3 rounded-xl border transition-all duration-300 ease-out
                          ${isActive
                            ? "border-(--accent-action) bg-(--surface-featured)"
                            : "border-(--border-subtle) bg-(--surface-primary) hover:border-(--accent-action)/50"
                          }`}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded-full bg-(--surface-featured) border border-(--border-subtle) text-[9px] font-semibold text-(--text-muted) font-satoshi">
                            {milestone.versionName}
                          </span>
                          {milestone.isMajor && (
                            <span className="px-1.5 py-0.5 rounded-full bg-(--accent-action) text-white text-[9px] font-semibold font-satoshi shrink-0">
                              Breakthrough
                            </span>
                          )}
                        </div>

                        <p className={`text-xs font-semibold font-satoshi leading-snug mt-1.5
                          ${isActive ? "text-(--accent-action)" : "text-(--text-primary)"}`}
                        >
                          {milestone.title}
                        </p>
                        <p className="text-[10px] text-(--text-muted) mt-0.5 font-satoshi">
                          {formatTimestamp(milestone.createdAt)}
                        </p>
                        <p className="text-xs text-(--text-secondary) mt-1.5 font-satoshi line-clamp-2 leading-relaxed">
                          {milestone.evolutionContext}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleRestore(milestone)}
                          className={`mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all duration-300 ease-out font-satoshi
                            ${isActive
                              ? "bg-(--accent-action)/10 text-(--accent-action) hover:bg-(--accent-action)/20"
                              : "border border-(--border-subtle) text-(--text-muted) hover:border-(--accent-action) hover:text-(--accent-action)"
                            }`}
                        >
                          <RotateCcw size={10} />
                          Restore to Draft
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {milestones.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllMilestones((value) => !value)}
                  className="group mt-5 w-full overflow-hidden rounded-2xl border border-(--accent-action)/40 bg-linear-to-r from-(--accent-action)/10 via-(--surface-featured) to-(--accent-action)/5 px-4 py-3 text-xs text-(--accent-action) shadow-[0_0_28px_rgba(245,158,11,0.08)] transition-all hover:border-(--accent-action) hover:shadow-[0_0_34px_rgba(245,158,11,0.18)]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-(--accent-action)/50 bg-(--accent-action)/10 transition-transform group-hover:scale-105">
                      <Clock size={13} />
                    </span>
                    <span className="font-semibold">
                      {showAllMilestones ? "Show Latest Only" : `View All Milestones (${milestones.length})`}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-300 ${showAllMilestones ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LineageSidebar;
