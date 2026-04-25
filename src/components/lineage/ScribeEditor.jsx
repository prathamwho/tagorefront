import React, { useCallback, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useEditorStore } from "../../store/useEditorStore";
import { useLineageStore } from "../../store/useLineageStore";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

/* ─── Toolbar button ─────────────────────────────────────────────────────── */
const ToolbarBtn = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`px-2.5 py-1 rounded text-xs font-medium border transition-all duration-300 ease-out cursor-pointer
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-(--surface-featured)"}
      ${active
        ? "bg-(--accent-action) border-(--accent-action) text-white"
        : "border-(--border-subtle) text-(--text-secondary)"
      }`}
  >
    {children}
  </button>
);

/* ─── Save status pill ───────────────────────────────────────────────────── */
const SaveStatusBadge = ({ projectId, saveStatus }) => (
  <span
    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium font-satoshi
      ${saveStatus === "Saved"
        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
        : saveStatus === "Saving..."
          ? "bg-blue-50 border-blue-200 text-blue-600"
          : "bg-amber-50 border-amber-200 text-amber-600"
      }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full shrink-0
        ${saveStatus === "Saved"
          ? "bg-emerald-400"
          : saveStatus === "Saving..."
            ? "bg-blue-400"
            : "bg-amber-400"
        }`}
    />
    {projectId ? saveStatus : "Local draft"}
  </span>
);

/* ─── ScribeEditor ───────────────────────────────────────────────────────── */
const ScribeEditor = () => {
  const { content, setContent } = useEditorStore();
  const { openModal } = useLineageStore();
  const { projectId, activePapers, saveStatus, setManuscriptContent, saveDraft } =
    useWorkspaceStore();

  // ── Refs so the debounced function never needs to be recreated ──────────
  const saveTimerRef   = useRef(null);
  const saveDraftRef   = useRef(saveDraft);
  const activePapersRef = useRef(activePapers);

  useEffect(() => { saveDraftRef.current = saveDraft; },     [saveDraft]);
  useEffect(() => { activePapersRef.current = activePapers; }, [activePapers]);

  // Stable debounced autosave — never recreated, always reads latest refs
  const debouncedSaveDraft = useCallback((json) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraftRef.current({
        currentManuscript: json,
        activePapers: activePapersRef.current,
      });
    }, 3000);
  }, []); // intentionally empty — stability via refs

  // Cancel pending save on unmount
  useEffect(() => () => clearTimeout(saveTimerRef.current), []);

  // Track what the editor last wrote so rehydration doesn't loop
  const lastInternalContent = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p></p>",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      lastInternalContent.current = json;
      setContent(json);
      setManuscriptContent(json);
      debouncedSaveDraft(json);
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[calc(100vh-140px)] px-12 py-8 focus:outline-none text-base text-(--text-primary) font-satoshi leading-relaxed",
      },
    },
  });

  // Rehydration: when content changes from outside (milestone restore),
  // update Tiptap without emitting another onUpdate.
  useEffect(() => {
    if (!editor || !content || Object.keys(content).length === 0) return;
    if (JSON.stringify(content) === JSON.stringify(lastInternalContent.current)) return;
    editor.commands.setContent(content, false);
    lastInternalContent.current = content;
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full bg-(--surface-primary)">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-(--border-subtle) bg-(--surface-primary) sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-(--text-primary) font-satoshi">
            Tagore Scribe
          </span>
          <span className="text-xs text-(--text-muted)">Manuscript</span>
          <SaveStatusBadge projectId={projectId} saveStatus={saveStatus} />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5">
          <ToolbarBtn
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >H1</ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >H2</ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >B</ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          ><em>I</em></ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >• List</ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >1. List</ToolbarBtn>

          <div className="w-px h-4 bg-(--border-subtle) mx-1" />

          <ToolbarBtn
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >Undo</ToolbarBtn>
          <ToolbarBtn
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >Redo</ToolbarBtn>

          <div className="w-px h-4 bg-(--border-subtle) mx-1" />

          <button
            type="button"
            onClick={openModal}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-(--accent-action) text-white cursor-pointer transition-all duration-300 ease-out hover:opacity-90 active:scale-95"
          >
            Register Milestone
          </button>
        </div>
      </div>

      {/* ── BubbleMenu ──────────────────────────────────────────────────── */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) shadow-md"
      >
        <ToolbarBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >B</ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        ><em>I</em></ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >H1</ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >H2</ToolbarBtn>
      </BubbleMenu>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default ScribeEditor;
