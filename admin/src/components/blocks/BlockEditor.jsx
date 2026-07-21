'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LuChevronUp, LuChevronDown, LuTrash2, LuPlus, LuGripVertical } from 'react-icons/lu';
import { BLOCK_REGISTRY } from './registry';

export default function BlockEditor({ blocks, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  const reindex = (list) => list.map((b, i) => ({ ...b, order: i }));

  const addBlock = (type) => {
    const config = BLOCK_REGISTRY[type];
    const newBlock = { id: uuidv4(), type, order: sorted.length, data: { ...config.defaultData } };
    onChange(reindex([...sorted, newBlock]));
    setShowPicker(false);
  };

  const updateBlockData = (id, data) => {
    onChange(sorted.map((b) => (b.id === id ? { ...b, data } : b)));
  };

  const removeBlock = (id) => {
    onChange(reindex(sorted.filter((b) => b.id !== id)));
  };

  const moveBlock = (id, direction) => {
    const idx = sorted.findIndex((b) => b.id === id);
    const swapWith = direction === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    const next = [...sorted];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    onChange(reindex(next));
  };

  return (
    <div className="space-y-4">
      {sorted.map((block, idx) => {
        const config = BLOCK_REGISTRY[block.type];
        if (!config) {
          return (
            <div key={block.id} className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
              Unknown block type: {block.type}
            </div>
          );
        }
        const Editor = config.Editor;
        return (
          <div key={block.id} className="card p-4">
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <LuGripVertical size={14} className="text-gray-300" />
                {config.label}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveBlock(block.id, 'up')} disabled={idx === 0} className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30">
                  <LuChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={idx === sorted.length - 1}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                >
                  <LuChevronDown size={16} />
                </button>
                <button type="button" onClick={() => removeBlock(block.id)} className="rounded p-1 text-red-500 hover:bg-red-50">
                  <LuTrash2 size={16} />
                </button>
              </div>
            </div>
            {Editor ? (
              <Editor data={block.data} onChange={(data) => updateBlockData(block.id, data)} />
            ) : (
              <p className="text-xs text-gray-400">A horizontal divider — no configuration needed.</p>
            )}
          </div>
        );
      })}

      {!sorted.length && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
          No content blocks yet. Add your first block below.
        </div>
      )}

      <div className="relative">
        <button type="button" onClick={() => setShowPicker((s) => !s)} className="btn-secondary">
          <LuPlus size={16} /> Add Block
        </button>
        {showPicker && (
          <div className="absolute z-10 mt-2 grid w-56 grid-cols-1 gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            {Object.entries(BLOCK_REGISTRY).map(([type, config]) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-brand-50 hover:text-brand"
              >
                {config.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
