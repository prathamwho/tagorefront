import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Menu, Search, Bell, Plus, LogOut } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'sonner';

const Navbar = () => {
  const { authUser, setAuthUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setTimeout(() => {
        setAuthUser(null);
      }, 1000);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Problem logging out!');
    }
  };

  return (
    <nav className="bg-[#010409] text-white px-4 py-3 border-b border-gray-800 flex items-center justify-between sticky top-0 z-50">
      
      {/* Left Section: Logo & Mobile Menu */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-400 border border-gray-700 rounded-md p-1">
          <Menu size={20} />
        </button>
        
        <Link to="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
          {/* Simple Circle Icon as Logo Placeholder */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-serif font-black">
            T
          </div>
          <span className="hidden md:block font-serif">Tagore</span>
        </Link>

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
            <Link to="/" className="hover:text-gray-300">Explore</Link>
            <Link to="/workspace" className="hover:text-gray-300">Workspace</Link>
          </div>
        </div>
      </div>

      {/* Right Section: User Actions (DYNAMIC) */}
      <div className="flex items-center gap-3">
        
        {authUser ? (
          /* === STATE 1: LOGGED IN === */
          <>
            <button className="text-gray-400 hover:text-blue-400 border border-gray-700 rounded-md p-1 hidden sm:block">
              <Plus size={16} />
            </button>
            
            <button className="relative text-gray-400 hover:text-white">
              <Bell size={18} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-[#010409] bg-blue-500 transform translate-x-1/2 -translate-y-1/4"></span>
            </button>

            {/* Profile Dropdown / Actions */}
            <div className="flex items-center gap-3 pl-2 border-l border-gray-800 ml-2">
               <Link to="/profile" className="flex items-center gap-2 hover:bg-[#161b22] py-1 px-2 rounded transition-colors">
                  <div className="w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold">
                    {authUser.fullName ? authUser.fullName.charAt(0) : "U"}
                  </div>
                  <span className="text-xs font-semibold hidden md:block">{authUser.fullName}</span>
               </Link>

               <button 
                 onClick={handleLogout} 
                 title="Logout"
                 className="text-gray-400 hover:text-red-400 p-1 rounded-md hover:bg-red-400/10 transition-colors"
               >
                 <LogOut size={16} />
               </button>
            </div>
          </>
        ) : (
          /* === STATE 2: LOGGED OUT === */
          <div className="flex items-center gap-3">
             <Link to="/login" className="text-sm font-semibold text-white hover:text-gray-300">
               Sign in
             </Link>
             <Link to="/signup" className="text-sm font-semibold border border-gray-600 rounded-md px-3 py-1 hover:border-white transition-colors">
               Sign up
             </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
