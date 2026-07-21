import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-px flex flex-col items-center justify-center py-32 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 font-serif text-4xl italic text-ink">Page not found</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
        Back to Home
      </Link>
    </div>
  );
}
