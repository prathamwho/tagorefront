import React, { useEffect, useRef, useState } from 'react';
import NoteEditor from '../lib/tiptap';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useLocation, Link } from 'react-router-dom';
import ChatPanel from '../components/layout/ChatPanel.jsx';
import {PDFParse} from 'pdf-parse';
PDFParse.setWorker('https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf.worker.mjs'); //For browser build, set the web worker explicitly.

import {
  FileText, FileJson, X,
  Settings, MessageSquare, Share2, Plus,
  PenTool, LayoutGrid, Maximize2, ArrowBigLeftDash
} from 'lucide-react';


const ProjectWorkspace = () => {
  
  const location = useLocation();
  // Get papers passed from the search screen (or default to empty if visited directly)
  const initialPapers = location.state?.selectedPapers || [];
  
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [noteValue, setNoteValue] = useState("<p></p>");
  const [projtitle, setProjTitle] = useState();

  const getTitle = (e) => {
    setProjTitle(e.target.value);
    console.log(projtitle)
  }

  const [allText, setAllText] = useState("");
  

  
  
  const fetchedOnce = useRef(false);
  

  const workPDF = async(url) => { //parses pdf into text file which sends to backend

    try {

      const parser = new PDFParse({url: url});  
      const pdfresult = await parser.getText();
      setAllText(allText + " /newfile " + pdfresult.text); //all text from all seclected research papers
      
      const res = await fetch("http://localhost:1601/api/llm/send-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // cookie auth
        body: JSON.stringify(allText),
      });

      const result = res.json();
      console.log(result.message);


    } catch (error) {
      toast.error("Error reading research papers")
    }

  }


  const uploadPaper = async (e, paperId) => {
  try {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Upload PDF file only!");
      return;
    }

    const toastId = toast.loading("Uploading PDF...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", 'tagore_pdf');
    formData.append("folder", "Tagore_Cloud"); // uploading paper to cloudinary


    const res = await fetch("https://api.cloudinary.com/v1_1/dvbbmbius/raw/upload", //uploading as raw file for pdf
      { method: "POST", body: formData }
    );

    const data = await res.json();
    console.log("Cloudinary response:", data);
    if (!res.ok) {
      toast.dismiss(toastId);
      toast.error(data?.error?.message || "Upload failed");
      return;
    }

    const url = data.secure_url + "?response-content-disposition=inline"; //getting the uploaded file url

    //parsing pdf file 
    workPDF(url);

    setFiles((prev) =>
      prev.map((f) =>
        f.id === paperId
          ? { ...f, pdfUrl: url, rawUrl: url } 
          : f
      )
    );

    toast.dismiss(toastId);
    toast.success("PDF uploaded!");
  } catch (err) {
    toast.error("Upload failed!");
    console.log(err);
  }
};

/* NOTE DOWNLOAD */

const downloadFile = (content, filename, mimeType) => {
  if(projtitle===''){
    filename = "untitled"
  }
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

  const downloadNoteAsHTML = () => {
      const htmlDoc = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Research Notes</title>
    </head>
    <body>
    ${noteValue}
    </body>
    </html>`;
    console.log(projtitle)
    downloadFile(htmlDoc, projtitle, "text/html");
  };

  const downloadNoteAsTXT = () => {
      const plainText = noteValue.replace(/<[^>]*>/g, "");
      downloadFile(plainText, projtitle, "text/plain");
  };




  /* FETCHING SINGLE PAPER */
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchPaper = async () => {
      try {
        setFiles([]);
        const toastId = toast.loading("Loading papers!");

        const fetched = [];

        for (let index = 0; index < initialPapers.length; index++) {
          const raw = initialPapers[index];
          const articleId = typeof raw === "string" ? raw : raw?.id;
          if (!articleId) continue;

          const res = await axiosInstance.post("/article/getSinglePaper", { articleId });
          const data = res.data;

          const rawUrl = data?.bibjson?.link?.[0]?.url || "";

        fetched.push({
            id: String(data?.id || articleId),
            type: "pdf",
            title: data?.bibjson?.title || "Untitled Paper",
            authors: data?.bibjson?.author?.map(a => a.name).join(", ") || "",
            venue: data?.bibjson?.journal?.title || "",
            year: data?.bibjson?.year || "",
            abstract: data?.bibjson?.abstract || "No abstract available",
            rawUrl,
            pdfUrl: rawUrl.endsWith(".pdf") ? rawUrl : ""
        });

        }

        fetched.push({
          id: "note-1",
          title: "Research Notes",
          type: "note",
          content: "..."
        });

        setFiles(fetched);
        setActiveTab(fetched[0]?.id || "note-1");

        toast.dismiss(toastId);
      } catch (error) {
        toast.error("Unable to fetch papers!");
        console.log("Error in Project Workspace", error);
      }
    };

    if (initialPapers.length > 0) fetchPaper();
  }, [initialPapers]);

  useEffect(() => {
    if (files.length > 0 && !activeTab) {
      setActiveTab(files[0]?.id || "note-1");
    }
  }, [files, activeTab]);

  const activeFile = files.find(f => f?.id === activeTab);
  const closeTab = (fileId)=>{
    const closingFile = files.find(f=>f.id===fileId);
    if(!closingFile) return;

    const updatedFiles = files.filter(f=>f.id!==fileId);
    setFiles(updatedFiles);

    if(activeTab === fileId){
        const nextFile = updatedFiles[0];
        setActiveTab(nextFile ? nextFile.id: null);
    }

    
  }
  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden" id="project-workspace-root">

      {/* --- TOP HEADER --- */}
      <header className="h-12 border-b border-[#30363d] flex items-center justify-between px-4 bg-[#161b22] shrink-0" id="workspace-header">
        <div className="flex items-center gap-4" id="workspace-header-left">
          <Link to="/workspace" className="text-[#8b949e] hover:text-white" id="workspace-home-link">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center font-serif text-[10px] text-white font-bold" id="workspace-logo">
              T
            </div>
          </Link>
          <input className="text-sm font-medium" id="workspace-title" onChange={getTitle} placeholder='Untitled Research Project'></input>
        </div>

        <div className="flex items-center gap-3" id="workspace-header-right">
          <button className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#267af5] text-white text-xs font-medium rounded-md flex items-center gap-2" id="workspace-share-btn">
            <Share2 size={14} />
            <span>Share</span>
          </button>
          <Settings size={18} className="text-[#8b949e] cursor-pointer hover:text-white" id="workspace-settings-icon" />
          <div className="w-8 h-8 rounded-full bg-gray-700 ml-2" id="workspace-avatar"></div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden" id="workspace-layout">

        {/* 1. LEFT SIDEBAR (EXPLORER) */}
        <aside className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col" id="workspace-explorer">
          <div className="p-3 text-xs font-bold text-[#8b949e] uppercase tracking-wider flex justify-between items-center" id="workspace-explorer-header">
            <span>Explorer</span>
          </div>

          <div className="flex-1 overflow-y-auto" id="workspace-explorer-body">
            <div className="px-2 py-1" id="workspace-explorer-project">
              <div className="flex items-center gap-1 text-sm text-white font-medium mb-1 cursor-pointer" id="workspace-explorer-title">
                <span>Project Files</span>
              </div>

              <div className="pl-4 space-y-0.5" id="workspace-explorer-files">
                {/* List Files */}
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setActiveTab(file.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm ${activeTab === file.id
                      ? 'bg-[#1f6feb]/20 text-white'
                      : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'
                      }`}
                    id={`explorer-file-${file.id}`}
                  >
                    {file.type === 'pdf'
                      ? <FileText size={14} className="text-[#e36209]" id={`explorer-file-icon-pdf-${file.id}`} />
                      : <FileJson size={14} className="text-[#1f6feb]" id={`explorer-file-icon-note-${file.id}`} />
                    }
                    <span className="truncate" id={`explorer-file-title-${file.id}`}>{file.title}</span>
                  </div>
                ))}

                {/* Add New Button */}
                <div className="mt-2 flex items-center gap-2 px-2 py-1 text-xs text-[#8b949e] hover:text-white cursor-pointer" id="workspace-new-note">
                  <Plus size={14} />
                  <span>New Note</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 2. CENTER STAGE (VIEWER) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#161b22]" id="workspace-main">

          {/* Tabs Bar */}
          <div className="h-9 flex items-center bg-[#0d1117] border-b border-[#30363d] overflow-x-auto custom-scrollbar" id="workspace-tabs">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveTab(file.id)}
                className={`group h-full flex items-center gap-2 px-3 min-w-30 max-w-50 border-r border-[#30363d] cursor-pointer select-none text-xs ${activeTab === file.id
                  ? 'bg-[#161b22] text-white border-t-2 border-t-[#1f6feb]'
                  : 'bg-[#0d1117] text-[#8b949e] hover:bg-[#161b22]'
                  }`}
                id={`tab-${file.id}`}
              >
                {file.type === 'pdf'
                  ? <FileText size={12} className={activeTab === file.id ? "text-[#e36209]" : ""} id={`tab-icon-pdf-${file.id}`} />
                  : <FileJson size={12} className={activeTab === file.id ? "text-[#1f6feb]" : ""} id={`tab-icon-note-${file.id}`} />
                }
                <span className="truncate flex-1" id={`tab-title-${file.id}`}>{file.title}</span>
                <X size={12} className="opacity-0 group-hover:opacity-100 hover:text-white" id={`tab-close-${file.id}`}
                onClick={(e)=>{
                    e.stopPropagation();
                    closeTab(file.id);
                }} />
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 relative overflow-hidden" id="workspace-content">

            {files
                .filter(f => f.type === "pdf")
                .map((file) => (
                <div
                    key={file.id}
                    id={`pdf-container-${file.id}`}
                    className={`absolute inset-0 ${activeTab === file.id ? "block" : "hidden"}`}
                    >
                    {file.pdfUrl ? (
                    <iframe
                        id={`pdf-iframe-${file.id}`}
                        title={file.title}
                        src={file.pdfUrl}
                        className="w-full h-full border-0"
                    />
                    ) : (
                    <div className="p-6 text-sm text-[#8b949e] h-full flex flex-col items-center justify-center text-center gap-4">
                        <p>This paper cannot be embedded as PDF.<br/> You can download the paper and upload it for us.</p>

                        <a
                            href={file.rawUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1f6feb] underline"
                        >
                            Open paper in new tab 
                        </a>

                        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                          onClick={uploadPaper()}
                        >
                            Upload the paper
                        </button> */}
                        <label className="flex flex-col items-center gap-2">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => uploadPaper(e, file.id)}
                            className="hidden"
                          />
                          <div className="px-4 py-2 rounded-md bg-[#1f6feb] hover:bg-[#267af5] text-white text-xs font-medium cursor-pointer transition">
                            Upload PDF
                          </div>
                        </label>


                    </div>

                    )}
                </div>
                ))}

            {/* Note view */}
            {activeFile?.type === "note" && (
              <div className="h-full w-full p-8 bg-[#0d1117] overflow-y-auto" id="note-editor">

                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={downloadNoteAsHTML}
                    className="px-3 py-1.5 bg-[#1f6feb] hover:bg-[#267af5] text-white text-xs rounded-md"
                  >
                    Download HTML
                  </button>

                  <button
                    onClick={downloadNoteAsTXT}
                    className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs rounded-md border border-[#30363d]"
                  >
                    Download TXT
                  </button>
                </div>

                <NoteEditor value={noteValue} onChange={setNoteValue} />
              </div>
            )}

            </div>

        </main>

        {/* 3. RIGHT SIDEBAR (TOOLS) */}
        {rightPanelOpen?(
          <div className="max-w-80 flex flex-col min-h-0">
          <div className="h-9 border-b border-[#30363d] flex items-center px-2 bg-[#161b22]" id="workspace-right-panel-header">
              <div className="flex-1 flex gap-1" id="workspace-right-panel-tabs">
                <button className="px-3 py-1 text-xs font-medium text-white border-b-2 border-[#1f6feb]" id="right-tab-graph">Chat</button>
              </div>
              <button onClick={() => setRightPanelOpen(false)} id="right-panel-close-btn">
                <X size={14} className="text-[#8b949e]" />
              </button>
            </div>
          <ChatPanel/>          
          </div>
        ):(
          <div>
            <button
              className="button--primary fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md"
              onClick={() => setRightPanelOpen(true)}
            >
              <ArrowBigLeftDash size={14} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <footer className="h-6 bg-[#1f6feb] text-white text-[10px] flex items-center px-3 justify-between" id="workspace-footer">
        <div className="flex gap-4" id="workspace-footer-left">
          <span className="flex items-center gap-1" id="workspace-status">
            <LayoutGrid size={10} /> Workspace Ready
          </span>
          <span id="workspace-file-count">{files.length} Files</span>
        </div>
        <div className="flex gap-4" id="workspace-footer-right">
          
        </div>
      </footer>

    </div>
  );
};

export default ProjectWorkspace;
