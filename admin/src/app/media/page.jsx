'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { LuUpload, LuTrash2 } from 'react-icons/lu';
import ProtectedLayout from '../../components/ProtectedLayout';
import api, { API_BASE_URL } from '../../lib/api';

const ORIGIN = API_BASE_URL.replace('/api/v1', '');

export default function MediaPage() {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = () => api.get('/media').then((res) => setItems(res.data.data.items));

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Uploaded');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return;
    await api.delete(`/media/${id}`);
    load();
  };

  return (
    <ProtectedLayout title="Media Library">
      <div className="mb-5">
        <button className="btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <LuUpload size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {items.map((m) => (
          <div key={m.id} className="card overflow-hidden">
            <img src={`${ORIGIN}${m.url}`} alt={m.fileName} className="h-32 w-full object-cover" />
            <div className="flex items-center justify-between p-2">
              <p className="truncate text-xs text-gray-500">{m.fileName}</p>
              <button onClick={() => handleDelete(m.id)} className="text-red-500">
                <LuTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {!items.length && <p className="col-span-full text-center text-gray-400">No media uploaded yet.</p>}
      </div>
    </ProtectedLayout>
  );
}
