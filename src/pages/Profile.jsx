import React from 'react';
import Navbar from '../components/layout/Navbar';
import LeftPanel from '../components/layout/LeftPanel';
import RightProfilePanel from '../components/ui/RightProfilePanel';
import ProjectGrid from '../components/ui/ProjectGrid';
import { useAuthStore } from '../store/useAuthStore';
import userProfile from '../data/userProfile.json';


const Profile = () => {
  const {authUser} = useAuthStore();
  const user = authUser;
  console.log(authUser)
  const { projects } = userProfile;

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
            {/* You can add a 'Readme' or 'Pinned' header here if needed */}
            <div className="flex justify-between items-baseline mb-4">
               <h2 className="text-[16px] font-semibold text-[#c9d1d9]">
                 Projects
               </h2>
            </div>
            
            <ProjectGrid projects={projects} />
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