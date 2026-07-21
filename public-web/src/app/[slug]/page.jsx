import { notFound } from 'next/navigation';
import { getPageBySlug } from '../../lib/api';
import BlockRenderer from '../../components/BlockRenderer';

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return {};
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.excerpt || undefined,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || undefined,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function GenericPage({ params }) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <div className="container-px max-w-3xl py-14">
      {page.version && (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          {page.version} · {page.pageType}
        </p>
      )}
      <h1 className="font-serif text-4xl italic text-ink">{page.title}</h1>
      <div className="mt-8">
        <BlockRenderer blocks={page.blocks} />
      </div>
    </div>
  );
}
