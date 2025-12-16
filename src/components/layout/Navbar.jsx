import React from 'react';
import { Menu, Search, Bell, Plus, ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#010409] text-white px-4 py-3 border-b border-gray-800 flex items-center justify-between sticky top-0 z-50">
      
      {/* Left Section: Logo & Mobile Menu */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-400 border border-gray-700 rounded-md p-1">
          <Menu size={20} />
        </button>
        
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          {/* Simple Circle Icon as Logo Placeholder */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-serif font-black">
            T
          </div>
          <span className="hidden md:block font-serif">Tagore</span>
        </div>

        {/* Desktop Search & Links */}
        <div className="hidden md:flex items-center gap-4 ml-4">
          <div className="relative">
            <div className="flex items-center bg-[#0d1117] border border-gray-600 rounded-md px-2 py-1 w-64 focus-within:border-blue-500 focus-within:w-80 transition-all duration-200">
              <Search size={14} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Type / to search" 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full"
              />
              <span className="text-gray-500 text-xs border border-gray-600 rounded px-1">/</span>
            </div>
          </div>

          <div className="flex gap-4 text-sm font-semibold text-white/90">
            <a href="#" className="hover:text-gray-300">Pull requests</a>
            <a href="#" className="hover:text-gray-300">Issues</a>
            <a href="#" className="hover:text-gray-300">Codespaces</a>
            <a href="#" className="hover:text-gray-300">Marketplace</a>
            <a href="#" className="hover:text-gray-300">Explore</a>
          </div>
        </div>
      </div>

      {/* Right Section: User Actions */}
      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-blue-400 border border-gray-700 rounded-md p-1 hidden sm:block">
          <Plus size={16} />
        </button>
        
        <button className="relative text-gray-400 hover:text-white">
          <Bell size={18} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-[#010409] bg-blue-500 transform translate-x-1/2 -translate-y-1/4"></span>
        </button>

        <div className="flex items-center gap-1 cursor-pointer">
          <img 
            src="https://avatars.githubusercontent.com/u/98765432?v=4" 
            alt="Profile" 
            className="w-5 h-5 rounded-full border border-gray-600"
          />
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;