import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, FolderOpen, Hourglass } from "lucide-react";

const activityAccent = [
  {
    icon: Hourglass,
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    line: "bg-amber-500/25",
  },
  {
    icon: Hourglass,
    text: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    line: "bg-purple-500/25",
  },
  {
    icon: FolderOpen,
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    line: "bg-sky-500/25",
  },
  {
    icon: Hourglass,
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    line: "bg-emerald-500/25",
  },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-amber-500/20 bg-[#0a0f14]/95 px-3 py-2 shadow-2xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">{label}</p>
      <p className="mt-1 text-sm font-bold text-amber-400">{payload[0].value} milestones</p>
    </div>
  );
};

const ActivityItem = ({ item, index, isLast }) => {
  const accent = activityAccent[index % activityAccent.length];
  const Icon = accent.icon;
  const label = item.type === "workspace" ? "Workspace opened" : "Milestone added";

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <span className={`absolute left-[18px] top-10 bottom-0 w-px ${accent.line}`} />
      )}
      <div className={`z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${accent.border} ${accent.bg}`}>
        <Icon size={16} className={accent.text} />
      </div>

      <div className="min-w-0 flex-1 border-b border-(--border-subtle) pb-5">
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm font-bold ${accent.text}`}>{label}</p>
          <span className="shrink-0 text-xs text-(--text-muted)">{item.timeAgo}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-(--text-secondary)">
          {item.versionName ? `${item.versionName} ` : ""}
          {item.title}
        </p>
        <p className="mt-1 text-xs text-(--text-muted)">in {item.projectName}</p>
      </div>
    </div>
  );
};

const DashboardRightPane = ({ activityFeed = [], chartData = [], stats = {}, isLoading }) => {
  const totalMilestones =
    stats.totalMilestones ||
    stats.totalChartMilestones ||
    chartData.reduce((total, item) => total + Number(item.count || 0), 0);
  const workspaceCount = stats.workspaceCount || 0;

  return (
    <aside className="w-[340px] h-screen shrink-0 overflow-y-auto border-l border-(--border-subtle) bg-(--surface-primary) p-8 font-satoshi">
      <section className="rounded-3xl border border-(--border-subtle) bg-(--surface-secondary) p-6">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-(--text-primary)">Recent Activity</h2>
          <button className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300">
            View all
            <ArrowRight size={13} />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4 animate-pulse">
                <div className="h-9 w-9 rounded-xl bg-white/5" />
                <div className="flex-1">
                  <div className="h-4 w-2/3 rounded bg-white/5" />
                  <div className="mt-3 h-3 w-full rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : activityFeed.length ? (
          <div className="space-y-5">
            {activityFeed.map((item, index) => (
              <ActivityItem
                key={`${item.title}-${item.createdAt || index}`}
                item={item}
                index={index}
                isLast={index === activityFeed.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-(--border-subtle) p-5 text-center">
            <p className="text-sm font-semibold text-(--text-primary)">No activity yet.</p>
            <p className="mt-2 text-xs text-(--text-muted)">Milestones will appear here as you seal them.</p>
          </div>
        )}
      </section>

      <section className="mt-5 rounded-3xl border border-(--border-subtle) bg-(--surface-secondary) p-6">
        <h2 className="text-xl font-bold tracking-tight text-(--text-primary)">Your Research Journey</h2>
        <p className="mt-2 text-sm text-(--text-muted)">
          {totalMilestones} milestones across {workspaceCount} workspaces
        </p>

        <div className="mt-8 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="tagoreAmberTelemetry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.65} />
                  <stop offset="72%" stopColor="#f59e0b" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 700 }}
                width={34}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#f59e0b", strokeOpacity: 0.18 }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#tagoreAmberTelemetry)"
                activeDot={{ r: 5, stroke: "#f59e0b", strokeWidth: 2, fill: "#0a0f14" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </aside>
  );
};

export default DashboardRightPane;
