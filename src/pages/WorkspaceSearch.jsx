import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUp, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { axiosInstance } from '../lib/axios';

const WorkspaceSearch = () => {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState('IDLE'); // IDLE | SEARCHING | RESULTS
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;

  // --- SEARCH HANDLER ---
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearchState('SEARCHING');
    try {
      const res = await axiosInstance.post('/article/search', { parameter: query });
      setResults(res.data.results || []);
      setSearchState('RESULTS');
      setCurrentPage(1);
    } catch (error) {
      console.error("Search failed", error);
      setSearchState('IDLE');
    }
  };

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const currentResults = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return results.slice(start, start + resultsPerPage);
  }, [results, currentPage]);

  // --- SELECTION LOGIC ---
  const toggleSelection = (paper) => {
    const exists = selectedPapers.find(p => p.id === paper.id);
    if (exists) {
      setSelectedPapers(selectedPapers.filter(p => p.id !== paper.id));
    } else {
      setSelectedPapers([...selectedPapers, paper]);
    }
  };

  return (
    <div className="min-h-screen bg-(--surface-primary) text-(--text-primary)">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6">
        
        {/* --- 1. EDITORIAL WELCOMER (Centered) --- */}
        <div className={`text-center pt-32 transition-all duration-700 ${searchState !== 'IDLE' ? 'hidden' : 'block'}`}>
          <h1 className="text-3xl mt-16 font-bold tracking-tighter">Begin your research journey</h1>
        </div>

        {/* --- 2. THE SEARCH INTERFACE (State-Machine Driven) --- */}
        <div className={`transition-all duration-700 ease-in-out z-50 ${
          searchState === 'IDLE' 
          ? 'mt-12 max-w-2xl mx-auto relative' 
          : 'fixed top-16 left-0 right-0 bg-(--surface-primary) pt-8 pb-4' 
        }`}>
          <div className="max-w-4xl mx-auto px-6">
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center bg-(--surface-primary) border border-(--border-subtle) rounded-full p-1.5 shadow-sm focus-within:border-(--accent-action) transition-all">
                <Search className="ml-4 text-(--text-muted)" size={18} />
                
                <div className="flex-1 relative h-10 overflow-hidden">
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-full bg-transparent border-none outline-none text-base pl-4 font-medium"
                  />
                  {!query && <PlaceholderAnimation />}
                </div>

                {/* Arrow turns Dark Blue instantly when typing starts */}
                <button 
                  type="submit"
                  className={`p-2.5 rounded-full transition-all cursor-pointer mr-1 text-white ${
                    query.length > 0 ? 'bg-(--accent-action)' : 'bg-(--surface-featured) text-(--accent-action)'
                  }`}
                >
                  <ArrowUp size={18} strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- 3. RESULTS DISPLAY (Scrollable Area) --- */}
        <div className={`transition-all duration-1000 ${
          searchState === 'RESULTS' ? 'opacity-100 pt-56 pb-40' : 'opacity-0 pointer-events-none pt-0'
        }`}>
          
          {/* add results number
          <p className="text-sm text-(--text-muted) mb-8 font-medium">
            Search for "{query}" yielded {results.length.toLocaleString()} results:
          </p> */}

          <div className="space-y-2">
            {currentResults.map((paper) => (
              <SearchResultItem 
                key={paper.id} 
                paper={paper} 
                isSelected={selectedPapers.some(p => p.id === paper.id)}
                onToggle={() => toggleSelection(paper)}
              />
            ))}
          </div>

          {/* --- GROK-STYLE NUMERICAL PAGINATION --- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
              >
                <ChevronLeft size={18}/>
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentPage === i + 1 ? 'bg-(--accent-action) text-white' : 'hover:bg-(--surface-featured) text-(--text-muted)'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
              >
                <ChevronRight size={18}/>
              </button>
            </div>
          )}
        </div>

        {/* --- 4. WORKSPACE BUCKET (Bottom-Right Action) --- */}
        {selectedPapers.length >= 0 && (
          <WorkspaceBucket 
            count={selectedPapers.length} 
            onEnter={() => navigate('/workspace/ide', { state: { selectedPapers } })} 
          />
        )}
      </main>
    </div>
  );
};

// --- CUBIC PLACEHOLDER ANIMATION (UP-TO-DOWN) ---
const PlaceholderAnimation = () => {
  const phrases = [
    "Nobel Prize literature",
    "Quantum computing",
    "Cancer immunotherapy",
    "Climate resilience"
  ];

  return (
    <div className="absolute inset-0 pointer-events-none perspective-1000 pl-5">
      <div className="w-full h-full preserve-3d animate-cuboid">
        {phrases.map((text, i) => (
          <div 
            key={i}
            className="absolute inset-0 flex items-center text-(--text-muted) text-sm font-bold backface-hidden"
            style={{ transform: `rotateX(${i * -90}deg) translateZ(20px)` }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- RESEARCH ITEM (TOP-RIGHT SELECTION BULLET) ---
const SearchResultItem = ({ paper, isSelected, onToggle }) => {
  const bib = paper.bibjson || {};
  return (
    <div 
      onClick={onToggle}
      className={`group flex items-start justify-between p-5 rounded-2xl transition-all cursor-pointer border border-transparent ${
        isSelected ? 'bg-(--surface-featured) border-(--border-subtle)' : 'hover:bg-(--surface-featured)/40'
      }`}
    >
      <div className="flex-1 min-w-0 pr-10">
        <h3 className={`text-[17px] font-bold leading-tight mb-1.5 ${isSelected ? 'text-(--accent-action)' : 'text-(--text-primary)'}`}>
          {bib.title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-bold text-(--text-muted) uppercase tracking-wider mb-2">
            <span>{bib.journal?.title || 'Unknown Press'}</span>
            <span className="w-1 h-1 rounded-full bg-(--border-subtle)"></span>
            <span>{bib.year || '2024'}</span>
        </div>
        {bib.abstract && (
          <p className="text-sm text-(--text-secondary) line-clamp-2 leading-relaxed font-medium">
            {bib.abstract}
          </p>
        )}
      </div>

      {/* Circle Indicator: Top-Aligned, appearing on hover, filling on select */}
      <div className={`shrink-0 w-5 h-5 mt-1 rounded-full border-2 transition-all duration-300 flex items-center justify-center
        ${isSelected 
          ? 'bg-(--accent-action) border-(--accent-action)' 
          : 'border-(--border-medium) opacity-0 group-hover:opacity-100'
        }`}
      >
        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
    </div>
  );
};

// --- WORKSPACE BUCKET (FAB) ---
const WorkspaceBucket = ({ count, onEnter }) => {
  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button 
        onClick={onEnter}
        className="bg-(--surface-featured) text-(--accent-action) border border-(--accent-action)/20 px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-(--accent-action) hover:text-white transition-all flex items-center gap-3 cursor-pointer group"
      >
        <FileText size={18} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-bold">Enter Workspace ({count})</span>
      </button>
    </div>
  );
};

export default WorkspaceSearch;