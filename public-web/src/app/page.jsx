import Link from 'next/link';
import { getPageBySlug } from '../lib/api';
import BlockRenderer from '../components/BlockRenderer';

export default async function HomePage() {
  const page = await getPageBySlug('home');

  return (
    <div className="container-px py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium">
        <span className="text-brand">✓</span> Standards
      </span>
      <h1 className="mt-4 max-w-2xl font-serif text-5xl italic text-ink">
        {page ? page.title === 'Home' ? 'RenewCred Standards' : page.title : 'RenewCred Standards'}
      </h1>

      {page ? (
        <div className="mt-6 max-w-2xl">
          <BlockRenderer blocks={page.blocks} />
        </div>
      ) : (
        <p className="mt-6 max-w-2xl text-ink-soft">
          RenewCred is a carbon credits standard and registry, helping buyers and suppliers move forward with clarity
          and confidence.
        </p>
      )}

      <Link href="/standards" className="btn mt-8 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
        View Standards
      </Link>
    </div>
  );
}
