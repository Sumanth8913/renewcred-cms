'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { LuPlus, LuTrash2, LuCopy, LuPencil, LuSearch } from 'react-icons/lu';
import ProtectedLayout from '../../components/ProtectedLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../lib/api';

export default function PagesListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pages', { params: { search: search || undefined, status: status || undefined } });
      setItems(res.data.data.items);
    } catch (err) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search input
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/pages/${id}`);
      toast.success('Page deleted');
      load();
    } catch {
      toast.error('Failed to delete page');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/pages/${id}/duplicate`);
      toast.success('Page duplicated');
      load();
    } catch {
      toast.error('Failed to duplicate page');
    }
  };

  return (
    <ProtectedLayout title="Pages">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <LuSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              className="input w-64 pl-9"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <Link href="/pages/new" className="btn-primary">
          <LuPlus size={16} /> New Page
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-400">/{p.slug}</p>
                </td>
                <td className="px-5 py-3 capitalize text-gray-600">{p.pageType}</td>
                <td className="px-5 py-3 text-gray-600">{p.category?.name || '—'}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-3 text-gray-500">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/pages/${p.id}`} className="rounded p-1.5 text-gray-500 hover:bg-gray-100" title="Edit">
                      <LuPencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(p.id)}
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
                      title="Duplicate"
                    >
                      <LuCopy size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50"
                      title="Delete"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !items.length && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  No pages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ProtectedLayout>
  );
}
