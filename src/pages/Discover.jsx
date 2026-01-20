import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { useResearchStore } from '../store/useResearchStore';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const { featuredPapers, gridPapers, isLoading, fetchDiscovery } = useResearchStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscovery();
  }, []);

  return (
    <div className="min-h-screen bg-(--surface-primary)">
      <Navbar />

      <header className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Explore</h1>
        <p className="text-base text-(--text-secondary) max-w-xl">
          Discover peer-reviewed papers, ongoing experiments, and fundable scientific breakthroughs.
        </p>
      </header>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-(--surface-featured) rounded-3xl p-10 md:p-12 flex flex-col justify-center min-h-64 relative">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight mb-4 text-(--text-primary)">
              {isLoading
                ? "Fetching..."
                : featuredPapers[0]?.title || "Oceanic Carbon Sequestration Through Algae Bio-domes"}
            </h2>
            <p className="text-base text-(--text-secondary) mb-8">
              A scalable solution for reversing ocean acidification and reducing atmospheric CO2.
            </p>
          </div>

          <button
            onClick={() =>
              featuredPapers[0]?.id && navigate(`/research/${featuredPapers[0].id}`)
            }
            className="md:absolute right-12 bottom-12 px-8 py-2.5 border border-(--accent-action) text-(--accent-action) rounded-lg font-bold hover:bg-(--accent-action) hover:text-white transition-all cursor-pointer"
          >
            View Research
          </button>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div
                key={i}
                className="aspect-4/5 bg-(--surface-featured)/30 rounded-3xl animate-pulse"
              />
            ))
          ) : (
            gridPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => navigate(`/research/${paper.id}`)} // navigate
                className="cursor-pointer"
              >
                <ResearchCard paper={paper} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const ResearchCard = ({ paper }) => {
  return (
    <div
      className="group bg-(--card-surface) border border-(--border-subtle) rounded-3xl p-8 flex flex-col justify-between 
                 transition-all duration-500 ease-out 
                 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] 
                 aspect-[4/5.2]"
    >
      <div>
        <div className="flex justify-between items-center mb-6 h-6">
          <span className="bg-(--accent-action) text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            {paper.category || "BIOTECH"}
          </span>
          <ArrowUpRight
            className="text-(--text-primary) opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1"
            size={20}
          />
        </div>

        <h3 className="text-2xl font-bold leading-tight text-(--text-primary) mb-4 line-clamp-3">
          {paper.title}
        </h3>

        <p className="text-sm text-(--text-muted) leading-relaxed line-clamp-5">
          {paper.abstract}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-(--border-subtle)">
        <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest">
          {paper.institution || "CIMMYT MEXICO"}
        </p>
      </div>
    </div>
  );
};

export default Discover;
