import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { API_BASE_URL } from '../lib/api';

const ORIGIN = API_BASE_URL.replace('/api/v1', '');

const HEADING_STYLES = {
  1: 'text-4xl font-bold mb-4',
  2: 'text-2xl font-bold mb-3 mt-8',
  3: 'text-xl font-semibold mb-2 mt-6',
  4: 'text-lg font-semibold mb-2 mt-4',
};

function HeadingBlock({ data }) {
  const Tag = `h${data.level || 2}`;
  return <Tag className={HEADING_STYLES[data.level] || HEADING_STYLES[2]}>{data.text}</Tag>;
}

function RichTextBlock({ data }) {
  return (
    <div
      className="prose-content mb-4 leading-7 text-ink-soft [&_a]:text-brand [&_a]:underline [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: data.html || '' }}
    />
  );
}

function ListBlock({ data }) {
  const Tag = data.style === 'ordered' ? 'ol' : 'ul';
  return (
    <Tag className={`mb-4 space-y-1 pl-6 text-ink-soft ${data.style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
      {(data.items || []).map((item, idx) => (
        <li key={idx} className={item.startsWith('  ') ? 'ml-6 list-[circle]' : ''}>
          {item.trim()}
        </li>
      ))}
    </Tag>
  );
}

function TableBlock({ data }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {(data.headers || []).map((h, idx) => (
              <th key={idx} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {(data.rows || []).map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="whitespace-nowrap px-4 py-3 text-sm text-ink-soft">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquationBlock({ data }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg bg-gray-50 p-4">
      {data.displayMode ? <BlockMath math={data.equation} /> : <InlineMath math={data.equation} />}
      {data.caption && <p className="mt-2 text-xs text-gray-400">{data.caption}</p>}
    </div>
  );
}

function ImageBlock({ data }) {
  if (!data.url) return null;
  const src = data.url.startsWith('http') ? data.url : `${ORIGIN}${data.url}`;
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={data.alt || ''} className="w-full rounded-lg" />
      {data.caption && <figcaption className="mt-2 text-center text-sm text-gray-400">{data.caption}</figcaption>}
    </figure>
  );
}

const CALLOUT_STYLES = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  success: 'bg-green-50 border-green-200 text-green-800',
};

function CalloutBlock({ data }) {
  return (
    <div className={`my-4 rounded-lg border p-4 text-sm ${CALLOUT_STYLES[data.tone] || CALLOUT_STYLES.info}`}>
      {data.text}
    </div>
  );
}

function DividerBlock() {
  return <hr className="my-8 border-gray-200" />;
}

const RENDERERS = {
  heading: HeadingBlock,
  richtext: RichTextBlock,
  list: ListBlock,
  table: TableBlock,
  equation: EquationBlock,
  image: ImageBlock,
  callout: CalloutBlock,
  divider: DividerBlock,
};

export default function BlockRenderer({ blocks = [] }) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div>
      {sorted.map((block) => {
        const Renderer = RENDERERS[block.type];
        if (!Renderer) {
          // Unknown blocks fail gracefully rather than breaking the page.
          return (
            <div key={block.id} className="my-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-700">
              Unsupported content block: {block.type}
            </div>
          );
        }
        return <Renderer key={block.id} data={block.data} />;
      })}
    </div>
  );
}
