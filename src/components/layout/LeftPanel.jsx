import React from 'react';
import { Home, CircleDot, GitPullRequest, Layout, MessageSquare, Monitor, Telescope, Gift, Database } from 'lucide-react';

const LeftPanel = () => {
  return (
    <aside className="w-full text-[#c9d1d9] text-sm">
      
      {/* Primary Navigation */}
      <nav className="flex flex-col gap-1 mb-6">
        <NavItem icon={<Home size={16} />} label="Home" active />
        <NavItem icon={<CircleDot size={16} />} label="Issues" />
        <NavItem icon={<GitPullRequest size={16} />} label="Pull requests" />
        <NavItem icon={<Layout size={16} />} label="Projects" />
        <NavItem icon={<MessageSquare size={16} />} label="Discussions" />
        <NavItem icon={<Monitor size={16} />} label="Codespaces" />
      </nav>

      <div className="border-t border-[#21262d] my-4 mx-2"></div>

      {/* Secondary Navigation */}
      <nav className="flex flex-col gap-1 mb-6">
        <NavItem icon={<Telescope size={16} />} label="Explore" />
        <NavItem icon={<Gift size={16} />} label="Marketplace" />
        <NavItem icon={<Database size={16} />} label="MCP registry" />
      </nav>

      {/* Top Repositories Section */}
      <div className="px-2 mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-xs text-[#c9d1d9]">Top repositories</h3>
          <button className="bg-[#21262d] text-[#c9d1d9] p-1 rounded-md hover:bg-[#30363d]">
            <SearchIcon />
          </button>
        </div>
        
        <div className="flex flex-col gap-2">
           <RepoItem name="prathamwho/SQL-50" />
           <RepoItem name="prathamwho/FlightsAndSearch" />
           <RepoItem name="prathamwho/aiagent" />
           <RepoItem name="prathamwho/AuthService" />
        </div>
      </div>

    </aside>
  );
};

// Helper Components
const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${active ? 'bg-[#1f6feb] text-white font-semibold' : 'hover:bg-[#161b22]'}`}>
    {icon}
    <span>{label}</span>
  </div>
);

const RepoItem = ({ name }) => (
  <div className="flex items-center gap-2 px-1 cursor-pointer hover:underline text-[#c9d1d9]">
    <div className="w-4 h-4 rounded-full bg-yellow-600/20 flex items-center justify-center">
       <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
    </div>
    <span className="truncate">{name}</span>
  </div>
);

const SearchIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.98 6 6 0 0 1 8.98 7.92l3.134 3.134a.75.75 0 0 1-1.06 1.06l-3.133-3.134Zm-1.06-8.129a4.5 4.5 0 1 0-6.364 6.364 4.5 4.5 0 0 0 6.364-6.364Z" />
  </svg>
);

export default LeftPanel;