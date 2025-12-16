import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FileText, FileJson, ChevronRight, ChevronDown, X, 
  Settings, Search, MessageSquare, Share2, Plus, 
  MoreHorizontal, PenTool, LayoutGrid, Maximize2 
} from 'lucide-react';

const ProjectWorkspace = () => {
  const location = useLocation();
  // Get papers passed from the search screen (or default to empty if visited directly)
  const initialPapers = location.state?.selectedPapers || [];

  const [files, setFiles] = useState([
    ...initialPapers.map(p => ({ ...p, type: 'pdf' })), // Convert papers to "files"
    { id: 'note-1', title: 'Research Notes.md', type: 'note', content: '# My Analysis\n\nStart writing here...' }
  ]);

  const [activeTab, setActiveTab] = useState(files[0]?.id || 'note-1');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Helper to get active file
  const activeFile = files.find(f => f.id === activeTab);

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden">
      
      {/* --- TOP HEADER (Like VS Code) --- */}
      <header className="h-12 border-b border-[#30363d] flex items-center justify-between px-4 bg-[#161b22] shrink-0">
        <div className="flex items-center gap-4">
            <Link to="/workspace" className="text-[#8b949e] hover:text-white">
               <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center font-serif text-[10px] text-white font-bold">T</div>
            </Link>
            <span className="text-sm font-medium">Untitled Research Project</span>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#267af5] text-white text-xs font-medium rounded-md flex items-center gap-2">
                <Share2 size={14} />
                <span>Share</span>
            </button>
            <Settings size={18} className="text-[#8b949e] cursor-pointer hover:text-white" />
            <div className="w-8 h-8 rounded-full bg-gray-700 ml-2"></div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 1. LEFT SIDEBAR (EXPLORER) */}
        <aside className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col">
            <div className="p-3 text-xs font-bold text-[#8b949e] uppercase tracking-wider flex justify-between items-center">
                <span>Explorer</span>
                <MoreHorizontal size={14} />
            </div>
            
            {/* Project Folder */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-2 py-1">
                    <div className="flex items-center gap-1 text-sm text-white font-medium mb-1 cursor-pointer">
                        <ChevronDown size={16} />
                        <span>Project Files</span>
                    </div>
                    
                    <div className="pl-4 space-y-0.5">
                        {/* List Files */}
                        {files.map(file => (
                            <div 
                                key={file.id}
                                onClick={() => setActiveTab(file.id)}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                                    activeTab === file.id ? 'bg-[#1f6feb]/20 text-white' : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'
                                }`}
                            >
                                {file.type === 'pdf' ? <FileText size={14} className="text-[#e36209]" /> : <FileJson size={14} className="text-[#1f6feb]" />}
                                <span className="truncate">{file.title}</span>
                            </div>
                        ))}
                        
                        {/* Add New Button */}
                        <div className="mt-2 flex items-center gap-2 px-2 py-1 text-xs text-[#8b949e] hover:text-white cursor-pointer">
                            <Plus size={14} />
                            <span>New Note</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        {/* 2. CENTER STAGE (VIEWER) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#161b22]">
            
            {/* Tabs Bar */}
            <div className="h-9 flex items-center bg-[#0d1117] border-b border-[#30363d] overflow-x-auto custom-scrollbar">
                {files.map(file => (
                    <div 
                        key={file.id}
                        onClick={() => setActiveTab(file.id)}
                        className={`group h-full flex items-center gap-2 px-3 min-w-30 max-w-50 border-r border-[#30363d] cursor-pointer select-none text-xs ${
                            activeTab === file.id 
                            ? 'bg-[#161b22] text-white border-t-2 border-t-[#1f6feb]' 
                            : 'bg-[#0d1117] text-[#8b949e] hover:bg-[#161b22]'
                        }`}
                    >
                        {file.type === 'pdf' ? <FileText size={12} className={activeTab === file.id ? "text-[#e36209]" : ""} /> : <FileJson size={12} className={activeTab === file.id ? "text-[#1f6feb]" : ""} />}
                        <span className="truncate flex-1">{file.title}</span>
                        <X size={12} className="opacity-0 group-hover:opacity-100 hover:text-white" />
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
                {activeFile?.type === 'pdf' ? (
                    // --- MOCK PDF VIEWER ---
                    <div className="h-full w-full bg-[#525659] flex flex-col items-center overflow-y-auto p-8">
                        {/* Toolbar Mock */}
                        <div className="absolute top-4 bg-[#323639] text-white px-4 py-2 rounded-md shadow-lg flex gap-4 text-sm z-10">
                            <span>Page 1 / 12</span>
                            <span>|</span>
                            <span className="cursor-pointer hover:text-blue-400">-</span>
                            <span>100%</span>
                            <span className="cursor-pointer hover:text-blue-400">+</span>
                            <span>|</span>
                            <PenTool size={14} />
                        </div>
                        
                        {/* The "Paper" Page */}
                        <div className="w-200 min-h-275 bg-white shadow-2xl p-12 text-black mb-4">
                            <h1 className="text-3xl font-serif font-bold mb-4">{activeFile.title}</h1>
                            <div className="text-sm text-gray-600 mb-8 font-mono">{activeFile.authors} • {activeFile.venue} {activeFile.year}</div>
                            
                            <div className="columns-2 gap-8 text-sm leading-relaxed text-justify">
                                <p className="mb-4"><strong>Abstract.</strong> {activeFile.abstract}</p>
                                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p className="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                <div className="w-full h-40 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-gray-400 my-6">
                                    [Figure 1: Architecture Diagram]
                                </div>
                                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- NOTE EDITOR MOCK ---
                    <div className="h-full w-full p-8 bg-[#0d1117] overflow-y-auto">
                        <div className="max-w-3xl mx-auto">
                            <input 
                                type="text" 
                                className="w-full bg-transparent text-4xl font-bold text-white outline-none mb-8 placeholder-gray-700"
                                defaultValue="Research Analysis"
                            />
                            <textarea 
                                className="w-full h-150 bg-transparent text-[#c9d1d9] text-lg leading-relaxed outline-none resize-none font-mono"
                                defaultValue="# Key Findings&#10;&#10;- The transformer architecture relies solely on attention mechanisms.&#10;- BERT introduces bidirectional context.&#10;&#10;## TODO&#10;[ ] Compare training costs&#10;[ ] Replicate Figure 3"
                            ></textarea>
                        </div>
                    </div>
                )}
            </div>
        </main>

        {/* 3. RIGHT SIDEBAR (TOOLS) */}
        {rightPanelOpen && (
            <aside className="w-80 bg-[#0d1117] border-l border-[#30363d] flex flex-col">
                {/* Tools Header */}
                <div className="h-9 border-b border-[#30363d] flex items-center px-2 bg-[#161b22]">
                    <div className="flex-1 flex gap-1">
                        <button className="px-3 py-1 text-xs font-medium text-white border-b-2 border-[#1f6feb]">Graph</button>
                        <button className="px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-white">Chat</button>
                        <button className="px-3 py-1 text-xs font-medium text-[#8b949e] hover:text-white">Citations</button>
                    </div>
                    <button onClick={() => setRightPanelOpen(false)}>
                        <X size={14} className="text-[#8b949e]" />
                    </button>
                </div>

                {/* Tool Content (Graph Placeholder) */}
                <div className="flex-1 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        {/* CSS-only Graph visual */}
                        <div className="relative w-full h-full">
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                            <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-gray-600 rounded-full"></div>
                            <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-gray-600 rounded-full"></div>
                            {/* Lines */}
                            <div className="absolute top-1/2 left-1/2 w-32 h-px bg-gray-700 -translate-y-1/2 -rotate-45 origin-left"></div>
                            <div className="absolute top-1/2 left-1/2 w-32 h-px bg-gray-700 -translate-y-1/2 rotate-135 origin-left"></div>
                        </div>
                    </div>
                    <div className="relative z-10 text-center mt-60">
                         <h3 className="text-sm font-semibold text-[#c9d1d9]">Knowledge Graph</h3>
                         <p className="text-xs text-[#8b949e] mt-1">Visualizing connections between 2 papers.</p>
                    </div>
                </div>

                {/* Chat Input at bottom */}
                <div className="p-3 border-t border-[#30363d] bg-[#161b22]">
                    <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2">
                        <MessageSquare size={14} className="text-[#8b949e]" />
                        <input type="text" placeholder="Ask AI about these papers..." className="bg-transparent text-xs text-white w-full outline-none" />
                    </div>
                </div>
            </aside>
        )}
      </div>

      {/* Footer Status Bar */}
      <footer className="h-6 bg-[#1f6feb] text-white text-[10px] flex items-center px-3 justify-between">
          <div className="flex gap-4">
              <span className="flex items-center gap-1"><LayoutGrid size={10} /> Workspace Ready</span>
              <span>{files.length} Files</span>
          </div>
          <div className="flex gap-4">
              <span>Ln 1, Col 1</span>
              <span>UTF-8</span>
              <span className="flex items-center gap-1"><Maximize2 size={10} /> Full Screen</span>
          </div>
      </footer>

    </div>
  );
};

export default ProjectWorkspace;