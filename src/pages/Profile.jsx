import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import LeftPanel from '../components/layout/LeftPanel';
import RightProfilePanel from '../components/ui/RightProfilePanel';
import ProjectGrid from '../components/ui/ProjectGrid';
import { useAuthStore } from '../store/useAuthStore';
import { FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';


const Profile = () => {
  const { authUser } = useAuthStore();
  const user = authUser;

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get(`/paper/getprojects?userId=${authUser._id}`);
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const newPaper = () => {
    navigate('/submit');
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Navbar />

      {/* Main 3-Column Grid Layout */}
      <div className="max-w-350 mx-auto pt-6 px-4 md:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_320px] gap-8 items-start">
          
          {/* COLUMN 1: Left Navigation Panel (Hidden on small mobile) */}
          <div className="hidden md:block sticky top-20">
            <LeftPanel />
          </div>

          {/* COLUMN 2: Center Content (Scrollable) */}
          <main className="min-w-0">

            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-[16px] font-semibold text-[#c9d1d9]">
                Projects
              </h2>

              <button onClick={newPaper} className="bg-[#1f6feb] text-white px-3 py-1.5 rounded-md text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap hover:bg-[#1a5fd1] cursor-pointer transition">
                <FilePlus /> New Paper
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-[#8b949e]">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-[#8b949e]">No projects found.</p>
            ) : (
              <ProjectGrid projects={projects} />
            )}

          </main>

          {/* COLUMN 3: Right Profile Panel */}
          <div className="hidden md:block sticky top-20">
            <RightProfilePanel user={user} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;