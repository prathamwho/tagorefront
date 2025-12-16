import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PenTool, CheckCircle2, PlusCircle, FileText, ArrowRight, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

// --- MOCK DATA (Realistic AI Papers) ---
const MOCK_RESULTS = [
  {
    id: 101,
    title: "Attention Is All You Need",
    authors: "Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin",
    venue: "NIPS",
    year: 2017,
    citations: "85,002",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely."
  },
  {
    id: 102,
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin, Chang, Lee, Toutanova",
    venue: "NAACL-HLT",
    year: 2019,
    citations: "72,105",
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers."
  },
  {
    id: 103,
    title: "Language Models are Few-Shot Learners (GPT-3)",
    authors: "Brown, Mann, Ryder, Subbiah et al.",
    venue: "NeurIPS",
    year: 2020,
    citations: "14,200",
    abstract: "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. We show that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches."
  },
  {
    id: 104,
    title: "Visual Transformers: Tokenizing the World",
    authors: "Dosovitskiy, Beyer, Kolesnikov, Weissenborn",
    venue: "ICLR",
    year: 2021,
    citations: "12,500",
    abstract: "While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. In vision, attention is either applied in conjunction with convolutional networks, or used to replace certain components of convolutional networks while keeping their overall structure in place."
  },
  {
    id: 105,
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: "Hu, Shen, Wallis, Allen-Zhu",
    venue: "ICLR",
    year: 2022,
    citations: "2,400",
    abstract: "An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to specific tasks or domains. As we pre-train larger models, full fine-tuning becomes less feasible. We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices."
  }
];

const WorkspaceSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPapers, setSelectedPapers] = useState([]);

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
                        <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[#8b949e] bg-[#0d1117] border border-[#30363d] rounded">⌘ K</kbd>
                    </div>
                </div>
            </div>

            {/* Start Note Button */}
            <button className="mt-4 flex items-center gap-2 text-sm text-[#8b949e] hover:text-white border border-[#30363d] hover:border-[#8b949e] bg-[#161b22] px-4 py-2 rounded-full transition-all">
                <PenTool size={14} />
                <span>Start with a blank note</span>
            </button>
        </div>


        {/* --- 2. MAIN SPLIT LAYOUT --- */}
        <div className="flex-1 flex gap-8 overflow-hidden">
            
            {/* LEFT COLUMN: SEARCH RESULTS */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4 pb-20">
                    {MOCK_RESULTS.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((paper) => {
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
                                        {paper.title}
                                    </h3>
                                    {isSelected ? (
                                        <CheckCircle2 className="text-[#238636]" size={24} />
                                    ) : (
                                        <PlusCircle className="text-[#8b949e] group-hover:text-[#58a6ff]" size={24} />
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-[#8b949e] mb-3 font-mono">
                                    <span className="text-[#58a6ff]">{paper.venue} {paper.year}</span>
                                    <span>•</span>
                                    <span>{paper.authors.split(',').slice(0, 3).join(', ')} et al.</span>
                                    <span>•</span>
                                    <span>{paper.citations} citations</span>
                                </div>

                                <p className="text-sm text-[#8b949e] line-clamp-2 leading-relaxed">
                                    {paper.abstract}
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
                                        {paper.title}
                                    </div>
                                    <div className="text-[10px] text-[#8b949e] font-mono">
                                        {paper.year} • {paper.venue}
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