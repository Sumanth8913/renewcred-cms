'use client';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../../lib/api';

const ORIGIN = API_BASE_URL.replace('/api/v1', '');

export default function ImageBlockEditor({ data, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange({ ...data, url: res.data.data.url, alt: data.alt || file.name });
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {data.url && (
        <img src={`${ORIGIN}${data.url}`} alt={data.alt || ''} className="max-h-48 rounded-lg border border-gray-200" />
      )}
      <div className="flex gap-2">
        <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : data.url ? 'Replace image' : 'Upload image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      <div>
        <label className="label">Alt text</label>
        <input className="input" value={data.alt || ''} onChange={(e) => onChange({ ...data, alt: e.target.value })} />
      </div>
      <div>
        <label className="label">Caption (optional)</label>
        <input className="input" value={data.caption || ''} onChange={(e) => onChange({ ...data, caption: e.target.value })} />
      </div>
    </div>
  );
}
