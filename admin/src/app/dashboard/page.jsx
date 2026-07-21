'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { LuFileText, LuCircleCheck, LuFilePen, LuFolderTree, LuImage, LuMail } from 'react-icons/lu';
import ProtectedLayout from '../../components/ProtectedLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { fetchDashboardStats } from '../../store/slices/pageSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats } = useSelector((s) => s.pages);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <ProtectedLayout title="Dashboard">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Pages" value={stats?.totalPages} icon={LuFileText} />
        <StatCard label="Published" value={stats?.publishedPages} icon={LuCircleCheck} />
        <StatCard label="Drafts" value={stats?.draftPages} icon={LuFilePen} />
        <StatCard label="Categories" value={stats?.totalCategories} icon={LuFolderTree} />
        <StatCard label="Media Files" value={stats?.totalMedia} icon={LuImage} />
        <StatCard label="Newsletter Subs" value={stats?.newsletterSubscribers} icon={LuMail} />
        <StatCard label="Form Submissions" value={stats?.formSubmissions} icon={LuFileText} />
      </div>

      <div className="card mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Pages</h2>
          <Link href="/pages" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-400">
              <th className="pb-2">Title</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentPages?.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2">
                  <Link href={`/pages/${p.id}`} className="font-medium text-gray-900 hover:text-brand">
                    {p.title}
                  </Link>
                </td>
                <td className="py-2">
                  <StatusBadge status={p.status} />
                </td>
                <td className="py-2 text-gray-500">{new Date(p.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!stats?.recentPages?.length && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-400">
                  No pages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/pages/new" className="btn-primary">
          + Create Page
        </Link>
        <Link href="/media" className="btn-secondary">
          Upload Media
        </Link>
      </div>
    </ProtectedLayout>
  );
}
