import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ArrowLeft, Share2, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore'; // <--- Import Store

const PaperView = () => {
  const { id } = useParams();
  const { getProjectById, selectedProject, isFetchingProjects } = useProjectStore();

  // Fetch the specific project from Backend when page loads
  useEffect(() => {
    getProjectById(id);
  }, [id, getProjectById]);

  // Loading State
  if (isFetchingProjects || !selectedProject) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1f6feb]" size={40} />
      </div>
    );
  }

  const paper = selectedProject;

  // Calculate Progress (Safely handle zeros)
  const raised = paper.amountRaised || 0;
  const goal = paper.fundingGoal || 1;
  const progressPercentage = Math.min((raised / goal) * 100, 100);

  // Calculate Days Left (Mock logic for now, or use paper.deadline)
  const daysLeft = paper.deadline 
    ? Math.ceil((new Date(paper.deadline) - new Date()) / (1000 * 60 * 60 * 24)) 
    : 30;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Navbar />

      <main className="max-w-300 mx-auto px-6 py-12">
        
        <Link to="/" className="inline-flex items-center gap-2 text-[#8b949e] hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Explore</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          
          {/* LEFT COLUMN: CONTENT */}
          <div>
            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[#58a6ff] mb-4">
              <span>{paper.category}</span>
              <span className="text-[#30363d]">|</span>
              <span>Published Oct 2024</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-medium text-white leading-tight mb-6">
              {paper.title}
            </h1>

            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {paper.researcherName?.charAt(0)}
              </div>
              <div>
                <div className="text-white font-medium">{paper.researcherName}</div>
                <div className="text-sm text-[#8b949e]">{paper.institution}</div>
              </div>
            </div>

            <div className="text-xl leading-relaxed text-[#c9d1d9] font-light mb-10 border-l-4 border-[#58a6ff] pl-6 italic">
              {paper.abstract}
            </div>

            {/* Render actual content or fallback */}
            <article className="prose prose-invert prose-lg max-w-none text-[#c9d1d9]">
               {paper.content ? (
                   <p>{paper.content}</p>
               ) : (
                   <p>Full research content loading...</p>
               )}
            </article>
          </div>

          {/* RIGHT COLUMN: FUNDING WIDGET */}
          <div className="hidden lg:block sticky top-24">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 shadow-xl">
              
              <div className="w-full bg-[#30363d] h-3 rounded-full mb-4 overflow-hidden">
                <div 
                  className="bg-[#238636] h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white">${raised.toLocaleString()}</span>
                      <span className="text-[#8b949e] text-sm">raised out of ${goal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#8b949e] text-sm mt-1">
                      <Clock size={16} />
                      <span className="font-semibold">{daysLeft} days left</span>
                    </div>
                </div>

                <div className="border-t border-[#30363d] my-1"></div>

                <div className="flex gap-3">
                    {/* Link to Fund Page with Real ID */}
                    <Link to={`/fund/${paper._id}`} className="flex-1">
                        <button className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 text-sm shadow-md">
                        <DollarSign size={16} />
                        Fund this project
                        </button>
                    </Link>
                    
                    <button className="px-3 border border-[#30363d] text-[#c9d1d9] rounded-md hover:bg-[#30363d] transition-colors flex items-center gap-2 font-medium text-sm">
                      <Share2 size={16} />
                      Share
                    </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PaperView;