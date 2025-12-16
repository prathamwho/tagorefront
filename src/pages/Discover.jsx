import React from 'react';
import Navbar from '../components/layout/Navbar';
import PublishedPaperCard from '../components/ui/PublishedPaperCard';
import papers from '../data/publishedPapers.json'; // Importing the NEW data

const Discover = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Navbar />

      <div className="max-w-350 mx-auto px-4 md:px-6 py-12">
        
        {/* Page Header */}
        <div className="mb-12 border-b border-[#30363d] pb-8">
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-white mb-4">
            Explore Research
          </h1>
          <p className="text-xl text-[#8b949e] font-light max-w-2xl">
            Discover peer-reviewed papers, ongoing experiments, and fundable scientific breakthroughs.
          </p>
        </div>

        {/* 3-Column Square Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <PublishedPaperCard key={paper.id} paper={paper} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Discover;