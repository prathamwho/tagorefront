import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Edit3,
  FileText,
  GitCommitVertical,
  Mail,
  Microscope,
} from "lucide-react";
import defaultAvatar from "../../public/default-Photo.png";

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

const workspaceAccents = [
  {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    icon: FileText,
  },
  {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    icon: Microscope,
  },
  {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    icon: BookOpen,
  },
  {
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-300",
    icon: GitCommitVertical,
  },
];

const ProfileHeader = ({ profile }) => {
  const navigate = useNavigate();
  const name = profile?.name || "Researcher";
  const role = profile?.role || "Researcher";
  const email = profile?.email || "No email connected";
  const quote =
    profile?.quote ||
    "Research is to see what everybody else has seen, and to think what nobody else has thought.";

  return (
    <section className="border-b border-(--border-subtle) pb-10">
      <div className="flex items-start justify-between gap-8">
        <div className="flex items-center gap-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl" />
            <img
              src={profile?.avatar || defaultAvatar}
              alt={name}
              className="relative h-24 w-24 rounded-full border border-amber-500/50 object-cover shadow-[0_0_42px_rgba(245,158,11,0.22)]"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-(--text-primary)">
              {name}
            </h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.22em] text-amber-400">
              {role}
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-(--text-secondary)">
              <Mail size={16} className="text-(--text-muted)" />
              {email}
            </div>
            <blockquote className="mt-6 max-w-xl text-base italic leading-8 text-(--text-muted)">
              "{quote}"
            </blockquote>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/profile/edit")}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-500/45 px-5 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10 hover:border-amber-500"
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
      </div>
    </section>
  );
};

const WorkspaceCard = ({ workspace, index }) => {
  const navigate = useNavigate();
  const accent = workspaceAccents[index % workspaceAccents.length];
  const Icon = accent.icon;
  const latestMilestone = workspace.latestMilestone || {};

  return (
    <article className="group rounded-2xl border border-(--border-subtle) bg-(--surface-secondary) p-6 transition hover:border-amber-500/35 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${accent.border} ${accent.bg}`}>
            <Icon size={22} className={accent.text} />
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-xl font-bold leading-snug text-(--text-primary)">
              {workspace.title || "Untitled Workspace"}
            </h3>
          </div>
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

      <div className="mt-6 border-t border-(--border-subtle) pt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
          Latest milestone
        </p>

        {latestMilestone?.title ? (
          <div className="mt-2">
            <p className="text-sm font-semibold text-(--text-secondary)">
              <span className="text-amber-400">{latestMilestone.versionName}</span>{" "}
              {latestMilestone.title}
            </p>
            <p className="mt-1 text-xs text-(--text-muted)">
              {formatDateTime(latestMilestone.createdAt)}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-(--text-muted)">No milestones sealed yet.</p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/workspace/ide/${workspace.projectId}`)}
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 transition hover:text-amber-300"
        >
          Resume
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
};

const WorkspaceSkeleton = () => (
  <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-secondary) p-6 animate-pulse">
    <div className="h-12 w-12 rounded-xl bg-white/5" />
    <div className="mt-5 h-5 w-3/4 rounded bg-white/5" />
    <div className="mt-3 h-4 w-1/2 rounded bg-white/5" />
    <div className="mt-8 h-px bg-white/5" />
    <div className="mt-5 h-4 w-2/3 rounded bg-white/5" />
  </div>
);

const DashboardCenterPane = ({ profile, workspaces, isLoading }) => {
  return (
    <main className="min-h-screen overflow-y-auto bg-(--surface-primary) px-10 py-10 font-satoshi">
      <ProfileHeader profile={profile} />

      <section className="mt-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-(--text-primary)">
              Active Workspaces
            </h2>
            <p className="mt-2 text-sm text-(--text-muted)">Pick up where you left off.</p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 transition hover:text-amber-300"
          >
            View all workspaces
            <ArrowRight size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((item) => (
              <WorkspaceSkeleton key={item} />
            ))}
          </div>
        ) : workspaces?.length ? (
          <div className="grid grid-cols-2 gap-6">
            {workspaces.slice(0, 4).map((workspace, index) => (
              <WorkspaceCard
                key={workspace.projectId || workspace.title}
                workspace={workspace}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-(--border-subtle) bg-(--surface-secondary) p-10 text-center">
            <h3 className="text-lg font-bold text-(--text-primary)">No active workspaces yet.</h3>
            <p className="mt-2 text-sm text-(--text-muted)">
              Start from Explore or create a workspace to begin your research command center.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default DashboardCenterPane;
