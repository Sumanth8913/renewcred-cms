import Link from 'next/link';

const NAV = [
  { href: '/standards', label: 'Standards' },
  { href: '/buyer', label: 'Buyer' },
  { href: '/supplier', label: 'Supplier' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="container-px flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold">
          <span className="text-brand">✓</span>
          <span>
            Renew<span className="text-brand">Cred</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/buyer" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Get Started
        </Link>
      </div>
    </header>
  );
}
