import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, GitCommitVertical } from "lucide-react";

const formatDateTime = (date) => {
  if (!date) return "No timestamp";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const WorkspaceCard = ({ workspace }) => {
  const navigate = useNavigate();
  const latestMilestone = workspace.latestMilestone || {};

  return (
    <article className="rounded-2xl border border-(--border-subtle) bg-(--surface-secondary) p-5 transition hover:border-amber-500/40">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10">
            <BookOpen size={20} className="text-amber-400" />
          </div>
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-(--text-primary)">
            {workspace.title || "Untitled Workspace"}
          </h3>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-(--text-muted)">Last active</p>
          <p className="mt-1 text-sm font-bold text-amber-400">{workspace.timeAgo || "recently"}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 text-xs font-medium text-(--text-muted)">
        <span className="inline-flex items-center gap-1.5">
          <FileText size={13} />
          {workspace.activePaperCount || 0} Papers
        </span>
        <span className="h-1 w-1 rounded-full bg-(--border-subtle)" />
        <span className="inline-flex items-center gap-1.5">
          <GitCommitVertical size={13} />
          {workspace.milestoneCount || 0} Milestone{workspace.milestoneCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5 border-t border-(--border-subtle) pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">Latest milestone</p>
        {latestMilestone?.title ? (
          <div className="mt-2">
            <p className="text-sm font-semibold text-(--text-secondary)">
              <span className="text-amber-400">{latestMilestone.versionName}</span>{" "}
              {latestMilestone.title}
            </p>
            <p className="mt-1 text-xs text-(--text-muted)">{formatDateTime(latestMilestone.createdAt)}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-(--text-muted)">No milestones sealed yet.</p>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/workspace/ide/${workspace.projectId}`)}
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 transition hover:text-amber-300"
        >
          Resume
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
};

const WorkspaceSkeleton = () => (
  <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-secondary) p-5 animate-pulse">
    <div className="h-11 w-11 rounded-lg bg-white/5" />
    <div className="mt-5 h-5 w-3/4 rounded bg-white/5" />
    <div className="mt-3 h-4 w-1/2 rounded bg-white/5" />
    <div className="mt-7 h-px bg-white/5" />
    <div className="mt-4 h-4 w-2/3 rounded bg-white/5" />
  </div>
);

const DashboardWorkspaces = ({ workspaces, isLoading }) => (
  <section className="mt-8">
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-(--text-primary)">Active Workspaces</h2>
        <p className="mt-1.5 text-sm text-(--text-muted)">Pick up where you left off.</p>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 transition hover:text-amber-300"
      >
        View all workspaces
        <ArrowRight size={15} />
      </button>
    </div>

    {isLoading ? (
      <div className="grid grid-cols-2 gap-5">
        {[0, 1, 2, 3].map((item) => (
          <WorkspaceSkeleton key={item} />
        ))}
      </div>
    ) : workspaces?.length ? (
      <div className="grid grid-cols-2 gap-5">
        {workspaces.slice(0, 4).map((workspace) => (
          <WorkspaceCard key={workspace.projectId || workspace.title} workspace={workspace} />
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-(--border-subtle) bg-(--surface-secondary) p-8 text-center">
        <h3 className="text-lg font-bold text-(--text-primary)">No active workspaces yet.</h3>
        <p className="mt-2 text-sm text-(--text-muted)">
          Start from Explore or create a workspace to begin your research command center.
        </p>
      </div>
    )}
  </section>
);

export default DashboardWorkspaces;
