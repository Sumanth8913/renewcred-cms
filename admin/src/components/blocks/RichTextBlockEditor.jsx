'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuList,
  LuListOrdered,
  LuUndo,
  LuRedo,
} from 'react-icons/lu';

function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm ${active ? 'bg-brand-50 text-brand' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
}

export default function RichTextBlockEditor({ data, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Link, Table.configure({ resizable: true }), TableRow, TableHeader, TableCell],
    content: data.html || '<p></p>',
    onUpdate: ({ editor }) => onChange({ ...data, html: editor.getHTML() }),
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <LuBold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <LuItalic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <LuList size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <LuListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()}
          title="Insert table"
        >
          Table
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <LuUndo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <LuRedo size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
