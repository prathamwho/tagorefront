import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, LayoutGrid, Compass, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <nav className="sticky top-0 z-50 bg-(--surface-primary)/95 backdrop-blur-md border-b border-(--border-subtle) px-8 h-16 flex items-center justify-between transition-all">

      {/* LEFT: Logo & Navigation */}
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="src/public/withoutBackground.png"
            alt="Tagore"
            className="w-8 h-8 bg-white rounded-l object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-xl tracking-tighter text-(--accent-action)">TAGORE</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[12px] font-bold uppercase tracking-widest text-(--text-secondary)">
          <Link to="/" className={`flex items-center gap-2 hover:text-(--accent-action) transition-colors ${location.pathname === '/' ? 'text-(--accent-action)' : ''}`}>
            <Compass size={14} /> Explore
          </Link>
          <Link to="/workspace" className={`flex items-center gap-2 hover:text-(--accent-action) transition-colors ${location.pathname.startsWith('/workspace') ? 'text-(--accent-action)' : ''}`}>
            <LayoutGrid size={14} /> Workspace
          </Link>
        </div>
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center gap-5">
        {authUser ? (
          /* STATE: LOGGED IN */
          <>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-(--surface-secondary) transition-colors cursor-pointer text-(--text-secondary)">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="h-6 w-1px bg-(--border-subtle)"></div>

            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-(--text-primary) leading-none mb-1">{authUser.fullName}</p>
                <p className="text-[10px] text-(--text-muted) uppercase tracking-tighter font-bold">Researcher</p>
              </div>
              <div className="w-9 h-9 rounded-full border border-(--border-subtle) p-0.5 group-hover:border-(--accent-action) transition-colors">
                <img className="rounded-full w-full h-full object-cover" src={authUser.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" />
              </div>
            </Link>

            <button onClick={logout} className="p-2 text-(--text-muted) hover:text-red-500 transition-colors cursor-pointer" title="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          /* STATE: LOGGED OUT */
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-(--text-secondary) hover:text-(--accent-action) transition-colors">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 rounded-xl text-sm font-bold border-2 border-(--accent-action) text-(--accent-action) 
             hover:bg-(--accent-action) hover:text-white transition-all duration-300 shadow-sm active:scale-95"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;