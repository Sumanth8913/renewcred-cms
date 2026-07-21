# Block Content Model

Every `Page.blocks` field is a JSON array of blocks with this shared envelope:

```ts
type Block = {
  id: string;       // stable id, used for React keys and TOC anchors
  type: string;      // one of the registered block types below
  order: number;      // sort key — the renderer always sorts by this first
  data: Record<string, any>; // shape owned by that block type
};
```

## Registered block types

| type       | data shape                                                        | used for                                  |
|------------|--------------------------------------------------------------------|--------------------------------------------|
| `heading`  | `{ text: string, level: 1-4 }`                                     | section headings, also drives the sticky TOC |
| `richtext` | `{ html: string }` (TipTap output)                                  | paragraphs, nested lists, inline tables, links |
| `list`     | `{ style: 'ordered' \| 'unordered', items: string[] }`               | simple lists; an item prefixed with two spaces renders indented (nested) |
| `table`    | `{ headers: string[], rows: string[][] }`                           | structured data tables |
| `equation` | `{ equation: string (LaTeX), displayMode: boolean, caption?: string }` | inline/block math via KaTeX |
| `image`    | `{ url: string, alt: string, caption?: string }`                     | single images, uploaded via the Media Library |
| `callout`  | `{ tone: 'info' \| 'warning' \| 'success', text: string }`            | highlighted notes |
| `divider`  | `{}`                                                                | visual section break |

## Extending with a new block type

Adding a block type is a three-file, additive change — nothing else in the
system needs to know it exists:

1. **Admin editor** — add a `<Type>BlockEditor.jsx` component in
   `admin/src/components/blocks/`, then register it (label + default data)
   in `admin/src/components/blocks/registry.js`.
2. **Public renderer** — add a `<Type>Block` component and a case in the
   `RENDERERS` map in `public-web/src/components/BlockRenderer.jsx`.
3. **Validator** — add the type string to the `type` enum in
   `backend/src/validators/page.validator.js`.

If a block type reaches the public renderer without a matching case (e.g.
content authored before a type was removed, or a version mismatch between
admin and public deploys), it renders a small "Unsupported content block"
notice instead of crashing the page — see `BlockRenderer`'s fallback.
