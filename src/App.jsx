import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

// --- IMPORT YOUR PAGES ---
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import PaperView from './pages/PaperView';
import FundProject from './pages/FundProject';
import LoginPage from './pages/LoginPage';  
import SignUpPage from './pages/SignUpPage'; 
import WorkspaceSearch from './pages/WorkspaceSearch';
import ProjectWorkspace from './pages/ProjectWorkspace';
import { Toaster } from 'sonner';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // 1. Check if user is logged in when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 2. Show loading spinner while checking backend
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1117] text-white">
        <Loader2 className="animate-spin w-10 h-10 text-[#1f6feb]" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<Discover />} />
        <Route path="/project/:id" element={<PaperView />} />

        {/* === AUTH ROUTES (The ones causing the error) === */}
        {/* If user is NOT logged in, show Login. If they ARE, send to Profile */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/profile" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/profile" />} />

        {/* === PROTECTED ROUTES === */}
        {/* If user IS logged in, show Page. If NOT, send to Login */}
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/fund/:id" element={authUser ? <FundProject /> : <Navigate to="/login" />} />
        <Route path="/workspace" element={authUser ? <WorkspaceSearch /> : <Navigate to="/login" />} />
        <Route path="/workspace/ide" element={authUser ? <ProjectWorkspace /> : <Navigate to="/login" />} />

      </Routes>
      <Toaster position='top-right' richColors/>
    </Router>
  );
}

export default App;