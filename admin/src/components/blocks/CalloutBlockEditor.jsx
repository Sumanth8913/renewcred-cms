'use client';

export default function CalloutBlockEditor({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">Tone</label>
        <select className="input w-40" value={data.tone || 'info'} onChange={(e) => onChange({ ...data, tone: e.target.value })}>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="success">Success</option>
        </select>
      </div>
      <div>
        <label className="label">Text</label>
        <textarea
          className="input"
          rows={3}
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
        />
      </div>
    </div>
  );
}
