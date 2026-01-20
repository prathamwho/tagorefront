import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ToolbarButton = ({ active, disabled, onClick, children }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-1 rounded-md text-xs border transition
        ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#161b22] cursor-pointer"
        }
        ${
          active
            ? "bg-[#1f6feb]/20 border-[#1f6feb] text-white"
            : "border-[#30363d] text-[#c9d1d9]"
        }
      `}
    >
      {children}
    </button>
  );
};

const NoteEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] p-4 focus:outline-none text-sm text-[#c9d1d9]",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
      <div className="flex flex-wrap gap-2 p-2 border-b border-[#30363d] bg-[#161b22]">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default NoteEditor;
