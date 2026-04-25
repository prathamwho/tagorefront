import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bookmark,
  Boxes,
  Compass,
  FileText,
  Home,
  LogOut,
  Microscope,
  Settings,
  Timer,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import tagoreLogo from "../../public/withoutBackground.png";

const menuItems = [
  { label: "Overview", icon: Home, to: "/profile", active: true },
  { label: "Explore", icon: Compass, to: "/discover" },
  { label: "Workspace", icon: Boxes, to: "/workspace" },
  { label: "Timeline", icon: BookOpen, to: "/profile" },
  { label: "Library", icon: FileText, to: "/profile" },
  { label: "Milestones", icon: Bookmark, to: "/profile" },
  { label: "Papers", icon: Microscope, to: "/profile" },
  { label: "Settings", icon: Settings, to: "/profile/edit" },
];

const NavItem = ({ item }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
        ${item.active
          ? "bg-amber-500/10 text-amber-400"
          : "text-(--text-secondary) hover:bg-(--surface-secondary) hover:text-(--text-primary)"
        }`}
    >
      {item.active && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.45)]" />
      )}
      <Icon
        size={17}
        strokeWidth={1.8}
        className={item.active ? "text-amber-400" : "text-(--text-muted) group-hover:text-amber-400"}
      />
      <span>{item.label}</span>
    </Link>
  );
};

const LogoMark = () => (
  <div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-500/60 bg-amber-500/10 shadow-[0_0_24px_rgba(245,158,11,0.12)]">
    <img
      src={tagoreLogo}
      alt="Tagore"
      className="h-7 w-7 object-contain"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  </div>
);

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 h-screen shrink-0 border-r border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) flex flex-col font-satoshi">
      <div className="h-[72px] shrink-0 px-6 flex items-center gap-3 border-b border-(--border-subtle)">
        <LogoMark />
        <div>
          <p className="text-lg font-bold tracking-tight text-amber-400">TAGORE</p>
          <p className="text-[10px] uppercase tracking-widest text-(--text-muted)">Command Center</p>
        </div>
      </div>

      <div className="px-6 py-5 border-b border-(--border-subtle)">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/90 text-sm font-bold text-black">
            {(authUser?.fullName || "T").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-(--text-primary)">
              {authUser?.fullName || "Researcher"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-(--text-muted)">
              {authUser?.role || "Researcher"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1">
        {menuItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </nav>

      <div className="px-6 pb-5 space-y-5">
        <div className="rounded-2xl border border-amber-500/25 bg-(--surface-secondary) p-4 shadow-[0_0_28px_rgba(245,158,11,0.05)]">
          <Timer size={20} className="text-amber-400" />
          <p className="mt-3 text-xs leading-relaxed text-(--text-secondary)">
            Every milestone captures the journey of discovery.
          </p>
          <Link to="/workspace" className="mt-3 inline-flex text-xs font-bold text-amber-400 hover:text-amber-300">
            Learn more {"->"}
          </Link>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-(--text-secondary) transition hover:bg-(--surface-secondary) hover:text-(--text-primary)"
        >
          <LogOut size={17} />
          Sign out
        </button>

        <div className="border-t border-(--border-subtle) pt-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            LIVE • LOCAL
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
