import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Boxes, Compass, LogOut, Settings, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import tagoreLogo from "../../public/withoutBackground.png";

const menuItems = [
  { label: "Explore", icon: Compass, to: "/discover" },
  { label: "Workspace", icon: Boxes, to: "/workspace" },
  { label: "Profile", icon: User, to: "/profile" },
  { label: "Settings", icon: Settings, to: "/profile/edit" },
];

const isActiveRoute = (pathname, item) => {
  if (item.to === "/profile") return pathname === "/profile";
  if (item.to === "/profile/edit") return pathname.startsWith("/profile/edit");
  return pathname.startsWith(item.to);
};

const NavItem = ({ item, active }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className={`relative flex items-center gap-3 px-6 py-3 text-sm font-medium transition
        ${active
          ? "text-amber-400 bg-(--surface-secondary)"
          : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-secondary)"
        }`}
    >
      {active && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />}
      <Icon size={17} strokeWidth={1.8} className={active ? "text-amber-400" : "text-(--text-muted)"} />
      {item.label}
    </Link>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="h-screen border-r border-(--border-subtle) bg-(--surface-primary) font-satoshi text-(--text-primary) flex flex-col">
      <div className="h-[72px] px-6 flex items-center gap-3 border-b border-(--border-subtle)">
        <div className="grid h-9 w-9 place-items-center rounded-lg border border-amber-500/50 bg-amber-500/10">
          <img src={tagoreLogo} alt="Tagore" className="h-6 w-6 object-contain" />
        </div>
        <span className="text-lg font-bold tracking-tight text-amber-400">TAGORE</span>
      </div>

      <div className="px-6 py-6 border-b border-(--border-subtle)">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500 text-sm font-bold text-black">
            {(authUser?.fullName || "T").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{authUser?.fullName || "Researcher"}</p>
            <p className="text-[10px] uppercase tracking-widest text-(--text-muted)">
              {authUser?.role || "Researcher"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            active={isActiveRoute(location.pathname, item)}
          />
        ))}
      </nav>

      <div className="border-t border-(--border-subtle) p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-2 py-3 text-sm font-medium text-(--text-secondary) transition hover:text-(--text-primary)"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
