import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublishedPaperCard = ({ paper }) => {
  return (
    // FIX 1: Use paper._id instead of paper.id
    <Link to={`/project/${paper._id}`} className="group block h-full">
      <div className="aspect-square flex flex-col justify-between border-2 border-[#30363d] bg-[#0d1117] p-6 hover:border-white transition-colors duration-300 cursor-pointer relative overflow-hidden h-full">
        
        <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b949e] border border-[#30363d] px-2 py-1 rounded-sm">
              {paper.category}
            </span>
            <ArrowUpRight className="text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>

          <h3 className="text-2xl md:text-3xl font-serif font-medium text-[#c9d1d9] leading-tight group-hover:text-white transition-colors line-clamp-4">
            {paper.title}
          </h3>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-[#8b949e] line-clamp-3 mb-4 font-light leading-relaxed">
            {paper.abstract}
          </p>
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#58a6ff]">
            {/* FIX 2: Use researcherName (DB field) OR researcher (JSON fallback) */}
            <span>{paper.researcherName || paper.researcher}</span>
            <span className="text-[#30363d]">|</span>
            <span>{paper.institution}</span>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default PublishedPaperCard;