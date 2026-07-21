import HeadingBlockEditor from './HeadingBlockEditor';
import RichTextBlockEditor from './RichTextBlockEditor';
import ListBlockEditor from './ListBlockEditor';
import TableBlockEditor from './TableBlockEditor';
import EquationBlockEditor from './EquationBlockEditor';
import ImageBlockEditor from './ImageBlockEditor';
import CalloutBlockEditor from './CalloutBlockEditor';

// Single source of truth for "what block types exist". Adding a new block
// type (e.g. "faq") means: add an entry here + one editor component +
// one case in the public BlockRenderer switch. Nothing else changes.
export const BLOCK_REGISTRY = {
  heading: { label: 'Heading', Editor: HeadingBlockEditor, defaultData: { text: '', level: 2 } },
  richtext: { label: 'Rich Text', Editor: RichTextBlockEditor, defaultData: { html: '<p></p>' } },
  list: { label: 'List', Editor: ListBlockEditor, defaultData: { style: 'unordered', items: [] } },
  table: { label: 'Table', Editor: TableBlockEditor, defaultData: { headers: ['Column 1'], rows: [['']] } },
  equation: { label: 'Math Equation', Editor: EquationBlockEditor, defaultData: { equation: '', displayMode: true } },
  image: { label: 'Image', Editor: ImageBlockEditor, defaultData: { url: '', alt: '' } },
  callout: { label: 'Callout', Editor: CalloutBlockEditor, defaultData: { tone: 'info', text: '' } },
  divider: { label: 'Divider', Editor: null, defaultData: {} },
};
