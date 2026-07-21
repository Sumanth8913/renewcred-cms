'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import BlockEditor from './blocks/BlockEditor';

export default function PageForm({ initialPage }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState(initialPage?.blocks || []);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: initialPage?.title || '',
      slug: initialPage?.slug || '',
      pageType: initialPage?.pageType || 'standard',
      status: initialPage?.status || 'DRAFT',
      excerpt: initialPage?.excerpt || '',
      version: initialPage?.version || '',
      categoryId: initialPage?.categoryId || '',
      metaTitle: initialPage?.metaTitle || '',
      metaDescription: initialPage?.metaDescription || '',
    },
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  const onSubmit = async (formValues) => {
    setSaving(true);
    const payload = {
      ...formValues,
      categoryId: formValues.categoryId || null,
      blocks,
    };
    try {
      if (initialPage) {
        await api.put(`/pages/${initialPage.id}`, payload);
        toast.success('Page updated');
      } else {
        const res = await api.post('/pages', payload);
        toast.success('Page created');
        router.replace(`/pages/${res.data.data.id}`);
        return;
      }
      router.push('/pages');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <div className="card p-5">
          <label className="label">Title</label>
          <input className="input" {...register('title', { required: true })} />

          <label className="label mt-4">Excerpt</label>
          <textarea className="input" rows={2} {...register('excerpt')} />
        </div>

        <div className="card p-5">
          <h3 className="mb-3 font-semibold text-gray-900">Content Blocks</h3>
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="card space-y-3 p-5">
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : initialPage ? 'Save Changes' : 'Create Page'}
          </button>

          <div>
            <label className="label">Status</label>
            <select className="input" {...register('status')}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="label">Page Type</label>
            <select className="input" {...register('pageType')}>
              <option value="page">Page</option>
              <option value="standard">Standard</option>
              <option value="doc">Documentation</option>
            </select>
          </div>

          <div>
            <label className="label">Slug (auto-generated if left blank)</label>
            <input className="input" placeholder="auto-generated" {...register('slug')} />
          </div>

          <div>
            <label className="label">Category</label>
            <select className="input" {...register('categoryId')}>
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Version</label>
            <input className="input" placeholder="v1.0.0" {...register('version')} />
          </div>
        </div>

        <div className="card space-y-3 p-5">
          <h3 className="font-semibold text-gray-900">SEO</h3>
          <div>
            <label className="label">Meta Title</label>
            <input className="input" {...register('metaTitle')} />
          </div>
          <div>
            <label className="label">Meta Description</label>
            <textarea className="input" rows={3} {...register('metaDescription')} />
          </div>
        </div>
      </div>
    </form>
  );
}
