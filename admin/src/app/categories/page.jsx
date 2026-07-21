'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import ProtectedLayout from '../../components/ProtectedLayout';
import api from '../../lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const load = () =>
    api.get('/categories').then((res) => setCategories(res.data.data));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    console.log("React State:", name);

    const inputValue = document.querySelector(
      'input[placeholder="e.g. EV"]'
    ).value;

    console.log("Input Value:", inputValue);

    try {
      const res = await api.post('/categories', {
        name: inputValue,
        icon: icon || undefined,
      });

      console.log(res.data);

      toast.success('Category created');

      setName('');
      setIcon('');

      load();
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      load();
    } catch (err) {
      console.log(err.response?.data);
      toast.error('Failed to delete category');
    }
  };

  return (
    <ProtectedLayout title="Categories">
      <form
        onSubmit={handleCreate}
        className="card mb-6 flex items-end gap-3 p-5"
      >
        <div className="w-16">
          <label className="label">Icon</label>

          <input
            type="text"
            className="input"
            placeholder="🔌"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="label">Name</label>

          <input
            type="text"
            className="input"
            placeholder="e.g. EV"
            value={name}
            onChange={(e) => {
              console.log("Typing:", e.target.value);
              setName(e.target.value);
            }}
          />
        </div>

        <button type="submit" className="btn-primary">
          <LuPlus size={16} /> Add
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="card flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <span>{c.icon}</span>

              <div>
                <p className="font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">
                  {c._count?.pages ?? 0} pages
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(c.id)}
              className="rounded p-1.5 text-red-500 hover:bg-red-50"
            >
              <LuTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </ProtectedLayout>
  );
}