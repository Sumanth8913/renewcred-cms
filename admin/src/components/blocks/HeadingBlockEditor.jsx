'use client';

export default function HeadingBlockEditor({ data, onChange }) {
  return (
    <div className="flex gap-3">
      <select
        className="input w-24"
        value={data.level || 2}
        onChange={(e) => onChange({ ...data, level: Number(e.target.value) })}
      >
        {[1, 2, 3, 4].map((l) => (
          <option key={l} value={l}>
            H{l}
          </option>
        ))}
      </select>
      <input
        className="input flex-1"
        placeholder="Heading text"
        value={data.text || ''}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
      />
    </div>
  );
}
