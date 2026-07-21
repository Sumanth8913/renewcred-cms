'use client';

import { useSelector } from 'react-redux';

export default function Topbar({ title }) {
  const admin = useSelector((s) => s.auth.admin);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{admin?.name || 'Admin'}</p>
          <p className="text-xs text-gray-500">{admin?.role || ''}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
          {(admin?.name || 'A').charAt(0)}
        </div>
      </div>
    </header>
  );
}
