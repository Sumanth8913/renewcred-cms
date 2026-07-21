'use client';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function EquationBlockEditor({ data, onChange }) {
  let renderError = null;

  return (
    <div className="space-y-3">
      <div>
        <label className="label">LaTeX expression</label>
        <input
          className="input font-mono"
          placeholder="e.g. E = mc^2"
          value={data.equation || ''}
          onChange={(e) => onChange({ ...data, equation: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!data.displayMode}
            onChange={(e) => onChange({ ...data, displayMode: e.target.checked })}
          />
          Display as block (centered, larger)
        </label>
      </div>
      <div>
        <label className="label">Caption (optional)</label>
        <input
          className="input"
          value={data.caption || ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-medium uppercase text-gray-400">Preview</p>
        {data.equation ? (
          (() => {
            try {
              return data.displayMode ? <BlockMath math={data.equation} /> : <InlineMath math={data.equation} />;
            } catch {
              return <p className="text-sm text-red-600">Invalid LaTeX expression</p>;
            }
          })()
        ) : (
          <p className="text-sm text-gray-400">Nothing to preview yet</p>
        )}
      </div>
    </div>
  );
}
