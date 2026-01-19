import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PenTool, CheckCircle2, PlusCircle, FileText, ArrowRight, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { toast } from 'sonner';
import { axiosInstance } from '../lib/axios';

const WorkspaceSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [results, setResults] = useState([]);

  const getSelection = async() => {
    try {
        const toastId  = toast.loading("Fetching results!");
        const res = await axiosInstance.post('/article/search', {
            parameter: searchQuery
        });
        let papers = res.data.results;
        setResults(papers);
        toast.dismiss(toastId);
        toast.success("Fetched results!");

    } catch (error) {
        console.log("Error in workspace search frontendpage", error);
        toast.error("Unable to fetch results!");
    }
  }

  // Toggle selection logic
  const toggleSelection = (paper) => {
    if (selectedPapers.find(p => p.id === paper.id)) {
      setSelectedPapers(selectedPapers.filter(p => p.id !== paper.id));
    } else {
      setSelectedPapers([...selectedPapers, paper]);
    }
  };

  const handleEnterWorkspace = () => {
    // Navigate to the main IDE (we will build this next)
    navigate('/workspace/ide', { state: { selectedPapers } });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Navbar />

      <main className="max-w-400 mx-auto px-6 py-8 h-[calc(100vh-64px)] flex flex-col">
        
        {/* --- 1. SEARCH HEADER (GLOWING) --- */}
        <div className="flex flex-col items-center mb-10 relative z-10">
            <div className="relative w-full max-w-2xl group">
                {/* The Blue Glow Effect */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-1000 group-hover:opacity-75"></div>
                
                <div className="relative flex items-center bg-[#161b22] rounded-lg border border-[#30363d] p-1">
                    <Search className="ml-4 text-[#8b949e]" size={20} />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for papers, DOI, or keywords..."
                        className="w-full bg-transparent border-none text-white px-4 py-3 outline-none placeholder-gray-500 font-medium"
                    />
                    
                    <div className="hidden md:flex items-center gap-2 mr-2">
                        <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[#8b949e] bg-[#0d1117] border border-[#30363d] rounded" 
                        onClick={()=>{
                            if(searchQuery!=""){
                                getSelection()
                            }
                        }} 
                        onKeyDown={(e)=>{
                            if(e.key==="Enter"){
                                e.preventDefault();
                                getSelection()}
                            }
                        
                        }>
                            Search
                        </kbd>
                    </div> 
                    
                </div>
            </div>

            {/* Start Note Button */}
            <button className="mt-4 flex items-center gap-2 text-sm text-[#8b949e] hover:text-white border border-[#30363d] hover:border-[#8b949e] bg-[#161b22] px-4 py-2 rounded-full transition-all" onClick={handleEnterWorkspace}>
                <PenTool size={14} />
                <span>Start with a blank note</span>
            </button>
        </div>


        {/* --- 2. MAIN SPLIT LAYOUT --- */}
        <div className="flex-1 flex gap-8 overflow-hidden">
            
            {/* LEFT COLUMN: SEARCH RESULTS */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4 pb-20">
                    {results.map((paper) => {
                        const isSelected = selectedPapers.find(p => p.id === paper.id);
                        return (
                            <div 
                                key={paper.id}
                                onClick={() => toggleSelection(paper)}
                                className={`group relative p-6 rounded-lg border transition-all cursor-pointer ${
                                    isSelected 
                                    ? 'bg-[#161b22] border-[#238636] shadow-[0_0_15px_-3px_rgba(35,134,54,0.2)]' 
                                    : 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e] hover:bg-[#161b22]'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`text-xl font-serif font-medium leading-tight max-w-[90%] ${isSelected ? 'text-white' : 'text-[#c9d1d9]'}`}>
                                        {paper.bibjson.title}
                                    </h3>
                                    {isSelected ? (
                                        <CheckCircle2 className="text-[#238636]" size={24} />
                                    ) : (
                                        <PlusCircle className="text-[#8b949e] group-hover:text-[#58a6ff]" size={24} />
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-[#8b949e] mb-3 font-mono">
                                    <span className="text-[#58a6ff]">{
                                        paper.bibjson.journal?.publisher || "Unknown journal"
                                        } {paper.bibjson.year}</span>
                                    <span>•</span>
                                    <span>
                                        {paper.bibjson.author
                                            ?.map(a => a.name)
                                            .join(", ") || "Unknown authors"}
                                    </span>
                                    <span>•</span>
                                </div>

                                <p className="text-sm text-[#8b949e] line-clamp-2 leading-relaxed">
                                    {paper.bibjson.abstract}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* RIGHT COLUMN: STAGING AREA (Sticky) */}
            <div className="w-87.5 flex flex-col bg-[#161b22] border border-[#30363d] rounded-xl h-full overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1117]/50 backdrop-blur">
                    <h2 className="font-semibold text-white">Selected Papers</h2>
                    <span className="bg-[#30363d] text-xs text-white px-2 py-0.5 rounded-full">
                        {selectedPapers.length}
                    </span>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedPapers.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#8b949e] opacity-50">
                            <FileText size={48} strokeWidth={1} className="mb-4" />
                            <p className="text-sm text-center">Your workspace is empty.<br/>Select papers to begin.</p>
                        </div>
                    ) : (
                        selectedPapers.map((paper) => (
                            <div key={paper.id} className="bg-[#0d1117] border border-[#30363d] p-3 rounded-md flex justify-between items-start group">
                                <div>
                                    <div className="font-medium text-sm text-[#c9d1d9] line-clamp-2 mb-1">
                                        {paper.bibjson.title}
                                    </div>
                                    <div className="text-[10px] text-[#8b949e] font-mono">
                                        {paper.bibjson.year} • {paper.bibjson.journal?.publisher}
                                    </div>

                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleSelection(paper); }}
                                    className="text-[#8b949e] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-[#30363d] bg-[#0d1117]/50 backdrop-blur">
                    <button 
                        onClick={handleEnterWorkspace}
                        disabled={selectedPapers.length === 0}
                        className="w-full bg-[#1f6feb] hover:bg-[#267af5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-900/20"
                    >
                        <span>Enter Workspace</span>
                        <ArrowRight size={16} />
                    </button>
                </div>

            </div>

        </div>

      </main>
    </div>
  );
};

export default WorkspaceSearch;