'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  LuLayoutDashboard,
  LuFileText,
  LuFolderTree,
  LuImage,
  LuLogOut,
} from 'react-icons/lu';
import { logout } from '../store/slices/authSlice';
import api from '../lib/api';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { href: '/pages', label: 'Pages', icon: LuFileText },
  { href: '/categories', label: 'Categories', icon: LuFolderTree },
  { href: '/media', label: 'Media', icon: LuImage },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout is best-effort server-side (stateless JWT) — always clear locally.
    }
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <span className="text-brand text-lg font-bold">✓</span>
        <span className="font-bold">RenewCred CMS</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? 'bg-brand-50 text-brand' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <LuLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
