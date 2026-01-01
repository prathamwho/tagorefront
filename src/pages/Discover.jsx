import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import PublishedPaperCard from '../components/ui/PublishedPaperCard';
import { useProjectStore } from '../store/useProjectStore'; // <--- Using the Store
import { Loader2 } from 'lucide-react';

const Discover = () => {
  // 1. Get the data and function from the store
  const { getAllProjects, projects, isFetchingProjects } = useProjectStore();

  // 2. Fetch data when the page loads
  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Navbar />

      <div className="max-w-350 mx-auto px-4 md:px-6 py-12">
        <div className="mb-12 border-b border-[#30363d] pb-8">
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-white mb-4">
            Explore Research
          </h1>
          <p className="text-xl text-[#8b949e] font-light max-w-2xl">
            Discover peer-reviewed papers, ongoing experiments, and fundable scientific breakthroughs.
          </p>
        </div>

        {/* Loading Spinner */}
        {isFetchingProjects && (
          <div className="flex justify-center py-20">
             <Loader2 className="animate-spin text-[#1f6feb]" size={40} />
          </div>
        )}

        {/* The Grid */}
        {!isFetchingProjects && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((paper) => (
              <PublishedPaperCard key={paper._id} paper={paper} />
            ))}
          </div>
        )}
        
        {!isFetchingProjects && projects.length === 0 && (
            <div className="text-center text-[#8b949e] py-10">
                No projects found. Did you run the seed script?
            </div>
        )}

      </div>
    </div>
  );
};

export default Discover;