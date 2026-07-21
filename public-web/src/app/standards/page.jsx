import Link from 'next/link';
import { getCategories } from '../../lib/api';

export const metadata = { title: 'RenewCred Standards' };

export default async function StandardsPage() {
  const categories = await getCategories();

  return (
    <div className="container-px py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium">
        <span className="text-brand">✓</span> Standards
      </span>
      <h1 className="mt-4 font-serif text-5xl italic text-ink">RenewCred Standards</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Lorem ipsum dolor sit amet consectetur. Gravida faucibus commodo leo eget commodo. Sit quis dolor non sed enim
        scelerisque.
      </p>

      <div className="mt-14 divide-y divide-gray-100">
        {categories.map((c) => (
          <div key={c.id} className="py-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-ink">
                <span>{c.icon}</span> {c.name}
              </h2>
              <Link href={`/standards/${c.slug}`} className="text-sm font-medium text-ink underline underline-offset-4 hover:text-brand">
                Read more
              </Link>
            </div>
            <p className="mt-4 max-w-4xl leading-7 text-ink-soft">
              Lorem ipsum dolor sit amet consectetur. Massa nec vulputate amet enim turpis elit odio fusce. Nunc
              cursus aliquet arcu vitae dolor ac rutrum pulvinar orci. Tristique nulla sed at nisl justo ipsum
              accumsan sed a. Enim amet varius ligula egestas. Integer vestibulum elementum non fermentum.
            </p>
          </div>
        ))}

        {!categories.length && <p className="py-10 text-center text-gray-400">No standards published yet.</p>}
      </div>
    </div>
  );
}
