import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useResearchStore } from '../store/useResearchStore';
import { ArrowLeft, Clock, Share2, DollarSign, Info } from 'lucide-react';

const PaperView = () => {
  const { id } = useParams();
  const { fetchPaperById, selectedPaper, isLoading } = useResearchStore();

  useEffect(() => {
    fetchPaperById(id);
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading || !selectedPaper) return <div className="min-h-screen bg-(--surface-primary) animate-pulse" />;

  const progress = (selectedPaper.amountRaised / selectedPaper.fundingGoal) * 100;

  return (
    <div className="min-h-screen bg-(--surface-primary) text-(--text-primary)">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-(--text-muted) hover:text-(--accent-action) mb-10 transition-colors">
          <ArrowLeft size={18} /> <span className="text-sm font-medium">Back to Explore</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
          
          {/* LEFT: DEFENSIVE CONTENT LAYER */}
          <div className="overflow-hidden">
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-(--accent-action) mb-6">
              <span className="truncate max-w-50">{selectedPaper.category}</span>
              <span className="w-1 h-1 rounded-full bg-(--border-subtle)"></span>
              <span className="text-(--text-muted)">Published Oct 2024</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-8 tracking-tight">
              {selectedPaper.title}
            </h1>

            {/* AUTHOR LIST: Defensive Truncation (2 lines max) */}
            <div className="flex items-start gap-4 mb-12 group">
              <div className="w-12 h-12 shrink-0 rounded-full bg-linear-to-br from-(--accent-action) to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
              <div className="min-w-0">
                <p className="font-bold text-(--text-primary) leading-tight line-clamp-2 mb-1">
                  {selectedPaper.authors}
                </p>
                <p className="text-xs text-(--text-muted) uppercase tracking-widest font-medium truncate">
                  {selectedPaper.institution}
                </p>
              </div>
            </div>

            {/* ABSTRACT: Styled Placeholder for empty states */}
            {selectedPaper.abstract ? (
              <div className="text-lg leading-relaxed text-(--text-secondary) font-medium border-l-4 border-(--accent-action) pl-8 mb-12 italic">
                {selectedPaper.abstract}
              </div>
            ) : (
              <div className="bg-(--surface-secondary) border-2 border-dashed border-(--border-subtle) rounded-2xl p-8 mb-12 flex flex-col items-center justify-center text-center">
                 <Info className="text-(--text-muted) mb-2" size={24} />
                 <p className="text-(--text-muted) font-medium italic">Detailed research summary is currently pending synthesis.</p>
              </div>
            )}

            <article className="prose prose-lg max-w-none text-(--text-secondary) mb-20">
              <p>This research has been indexed from global open-access repositories and is now eligible for community-driven micro-funding on the Tagore platform.</p>
              <a href={selectedPaper.externalUrl} target="_blank" className="text-(--accent-action) font-bold underline decoration-2 underline-offset-4">View Original Source</a>
            </article>
          </div>

          {/* RIGHT: REALISM WIDGET */}
          <div className="sticky top-28">
            <div className="bg-(--surface-primary) border border-(--border-subtle) rounded-[28px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              
              {/* TRIPLE-STOP GRADIENT BAR */}
              <div className="w-full bg-(--border-subtle) h-2 rounded-full mb-8 overflow-hidden relative">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${progress}%`,
                    background: `var(--accent-action)`
                  }} 
                />
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold tracking-tighter">${selectedPaper.amountRaised.toLocaleString()}</span>
                  <span className="text-(--text-muted) text-sm font-medium">raised of ${selectedPaper.fundingGoal.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-(--text-muted) text-xs">
                  <Clock size={14} /> <span className="font-bold">{selectedPaper.daysLeft} days left</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to={`/fund/${selectedPaper.id}`} className="flex-1">
                    <button className="w-full  bg-(--accent-action) hover:bg-[#029049] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
                    <DollarSign size={18} /> Fund this project
                    </button>
                </Link>
                <button className="p-3.5 border border-(--border-subtle) rounded-xl text-(--text-secondary) hover:bg-(--surface-secondary) transition-colors cursor-pointer">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaperView;