import React, { useState } from "react";
import { X } from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import { useLineageStore } from "../../store/useLineageStore";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

const MilestoneModal = () => {
  const { isModalOpen, closeModal, setActiveMilestoneId } = useLineageStore();
  const { content, clearPresentSnapshot } = useEditorStore();
  const { projectId, activePapers, createMilestone, createWorkspaceProject } = useWorkspaceStore();

  const [title, setTitle] = useState("");
  const [evolutionContext, setEvolutionContext] = useState("");
  const [isMajor, setIsMajor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setEvolutionContext("");
    setIsMajor(false);
    setIsSubmitting(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !evolutionContext.trim()) {
      setError("Both fields are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    if (!projectId) {
      const createdProjectId = await createWorkspaceProject();
      if (!createdProjectId) {
        setError("Unable to prepare workspace. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const milestone = await createMilestone({
      title: title.trim(),
      evolutionContext: evolutionContext.trim(),
      isMajor,
      currentManuscript: content,
      activePapers,
    });

    if (!milestone) {
      setError("Unable to seal milestone. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setActiveMilestoneId(milestone._id);
    clearPresentSnapshot();

    closeModal();
    resetForm();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    closeModal();
    resetForm();
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg mx-4 bg-(--surface-primary) border border-(--border-subtle) rounded-2xl shadow-2xl transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-(--border-subtle)">
          <div>
            <h2 className="text-base font-semibold text-(--text-primary) font-satoshi">
              Register Milestone
            </h2>
            <p className="text-xs text-(--text-muted) mt-0.5">
              Capture the intellectual leap you just made.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg hover:bg-(--surface-featured) text-(--text-muted) cursor-pointer transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-(--text-secondary) font-satoshi">
              Milestone Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Shifted hypothesis to biological mechanism"
              className="w-full px-3 py-2.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent-action) transition-all duration-300 ease-out font-satoshi"
            />
          </div>

          {/* Evolution Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-(--text-secondary) font-satoshi">
              Evolution Context
            </label>
            <textarea
              value={evolutionContext}
              onChange={(e) => setEvolutionContext(e.target.value)}
              placeholder="Explain the intellectual leap: why did your thinking change?"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent-action) transition-all duration-300 ease-out resize-none font-satoshi"
            />
          </div>

          {/* isMajor toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setIsMajor((v) => !v)}
              className={`w-10 h-5 rounded-full transition-all duration-300 ease-out flex items-center px-0.5 shrink-0
                ${isMajor ? "bg-(--accent-action)" : "bg-(--border-subtle)"}`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ease-out
                  ${isMajor ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
            <div>
              <span className="text-xs font-medium text-(--text-primary) font-satoshi">
                Mark as Breakthrough
              </span>
              <p className="text-[10px] text-(--text-muted) font-satoshi">
                Visually highlights this milestone as a major inflection point.
              </p>
            </div>
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-(--text-muted) border border-(--border-subtle) rounded-lg cursor-pointer hover:bg-(--surface-featured) transition-all duration-300 ease-out font-satoshi disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold bg-(--accent-action) text-white rounded-lg cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-300 ease-out font-satoshi disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sealing..." : "Seal Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneModal;
