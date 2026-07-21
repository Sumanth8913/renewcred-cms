'use client';

import { LuPlus, LuTrash2 } from 'react-icons/lu';

export default function TableBlockEditor({ data, onChange }) {
  const headers = data.headers || [];
  const rows = data.rows || [];

  const updateHeader = (idx, value) => {
    const next = [...headers];
    next[idx] = value;
    onChange({ ...data, headers: next });
  };

  const updateCell = (r, c, value) => {
    const next = rows.map((row) => [...row]);
    next[r][c] = value;
    onChange({ ...data, rows: next });
  };

  const addColumn = () => {
    onChange({
      ...data,
      headers: [...headers, `Column ${headers.length + 1}`],
      rows: rows.map((r) => [...r, '']),
    });
  };

  const removeColumn = (idx) => {
    onChange({
      ...data,
      headers: headers.filter((_, i) => i !== idx),
      rows: rows.map((r) => r.filter((_, i) => i !== idx)),
    });
  };

  const addRow = () => onChange({ ...data, rows: [...rows, headers.map(() => '')] });
  const removeRow = (idx) => onChange({ ...data, rows: rows.filter((_, i) => i !== idx) });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} className="border border-gray-200 p-1">
                <div className="flex items-center gap-1">
                  <input className="input" value={h} onChange={(e) => updateHeader(idx, e.target.value)} />
                  <button type="button" onClick={() => removeColumn(idx)} className="text-red-500">
                    <LuTrash2 size={14} />
                  </button>
                </div>
              </th>
            ))}
            <th className="p-1">
              <button type="button" onClick={addColumn} className="btn-secondary px-2 py-1 text-xs">
                <LuPlus size={12} /> Col
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="border border-gray-200 p-1">
                  <input className="input" value={cell} onChange={(e) => updateCell(r, c, e.target.value)} />
                </td>
              ))}
              <td className="p-1">
                <button type="button" onClick={() => removeRow(r)} className="text-red-500">
                  <LuTrash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow} className="btn-secondary mt-2 text-xs">
        <LuPlus size={14} /> Add row
      </button>
    </div>
  );
}
