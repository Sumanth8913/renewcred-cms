'use client';

import { LuPlus, LuTrash2 } from 'react-icons/lu';

// Flat list of strings kept simple; a leading "- " prefix on an item
// (added via the Indent button) is rendered as a nested sub-item by the
// public renderer — a lightweight way to support nesting without a tree UI.
export default function ListBlockEditor({ data, onChange }) {
  const items = data.items || [];

  const updateItem = (idx, value) => {
    const next = [...items];
    next[idx] = value;
    onChange({ ...data, items: next });
  };

  const addItem = () => onChange({ ...data, items: [...items, ''] });
  const removeItem = (idx) => onChange({ ...data, items: items.filter((_, i) => i !== idx) });
  const indentItem = (idx) => updateItem(idx, items[idx].startsWith('  ') ? items[idx].slice(2) : `  ${items[idx]}`);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <label className="label mb-0">Style</label>
        <select className="input w-40" value={data.style || 'unordered'} onChange={(e) => onChange({ ...data, style: e.target.value })}>
          <option value="unordered">Bulleted</option>
          <option value="ordered">Numbered</option>
        </select>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2" style={{ paddingLeft: item.startsWith('  ') ? 20 : 0 }}>
            <input className="input flex-1" value={item.trim()} onChange={(e) => updateItem(idx, item.startsWith('  ') ? `  ${e.target.value}` : e.target.value)} />
            <button type="button" onClick={() => indentItem(idx)} className="btn-secondary px-2 py-1 text-xs">
              {item.startsWith('  ') ? 'Outdent' : 'Indent'}
            </button>
            <button type="button" onClick={() => removeItem(idx)} className="rounded p-1.5 text-red-500 hover:bg-red-50">
              <LuTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addItem} className="btn-secondary mt-3 text-xs">
        <LuPlus size={14} /> Add item
      </button>
    </div>
  );
}
