import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '../../../lib/api';
import BlockRenderer from '../../../components/BlockRenderer';

export default async function StandardDetailPage({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  const headings = (page.blocks || [])
    .filter((b) => b.type === 'heading' && b.data.level <= 2)
    .sort((a, b) => a.order - b.order);

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null);

  return (
    <div className="container-px py-14">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium">
        <span className="text-brand">✓</span> Standards
      </span>
      <h1 className="mt-4 font-serif text-4xl italic text-ink">{page.category?.name || page.title}</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr_260px]">
        {/* Sticky table of contents */}
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-1 text-sm">
            <p className="mb-2 font-semibold text-ink">On this page</p>
            {headings.map((h) => (
              <a key={h.id} href={`#${h.id}`} className="block py-1 text-ink-soft hover:text-brand">
                {h.data.text}
              </a>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <article className="max-w-3xl">
          {(page.blocks || [])
            .sort((a, b) => a.order - b.order)
            .map((block) =>
              block.type === 'heading' ? (
                <div id={block.id} key={block.id} className="scroll-mt-24">
                  <BlockRenderer blocks={[block]} />
                </div>
              ) : (
                <BlockRenderer key={block.id} blocks={[block]} />
              )
            )}
        </article>

        {/* Version / certification panel */}
        <aside>
          <div className="sticky top-24 rounded-xl border border-gray-200 p-5 text-sm">
            <p className="font-semibold text-ink">Version</p>
            <p className="mt-3 text-2xl font-bold text-ink">{page.version || 'v1.0.0'}</p>
            {page.publicationDate && (
              <p className="mt-1 text-ink-soft">Certified - {fmt(page.publicationDate)}</p>
            )}
            {page.consultationStart && page.consultationEnd && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-medium uppercase text-gray-400">Public consultation</p>
                <p className="mt-1 text-ink-soft">
                  {fmt(page.consultationStart)} - {fmt(page.consultationEnd)}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="mt-14">
        <Link href="/standards" className="text-sm font-medium text-brand hover:underline">
          ← Back to Standards
        </Link>
      </div>
    </div>
  );
}
