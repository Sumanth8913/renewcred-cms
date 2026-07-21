const { z } = require('zod');

// Blocks are intentionally loosely typed at the transport boundary — each
// block's `data` shape is owned by its renderer/editor pair, not the API.
// We only enforce the structural envelope every block must share.
const blockSchema = z.object({
  id: z.string(),
  type: z.enum([
    'heading',
    'richtext',
    'list',
    'table',
    'equation',
    'image',
    'callout',
    'divider',
  ]),
  order: z.number().int().nonnegative(),
  data: z.record(z.any()),
});

const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .optional(),
  pageType: z.enum(['page', 'standard', 'doc']).default('standard'),
  excerpt: z.string().max(500).optional().nullable(),
  blocks: z.array(blockSchema).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  version: z.string().max(20).optional().nullable(),
  publicationDate: z.coerce.date().optional().nullable(),
  consultationStart: z.coerce.date().optional().nullable(),
  consultationEnd: z.coerce.date().optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(300).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
});

const updatePageSchema = createPageSchema.partial();

const listPagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  pageType: z.enum(['page', 'standard', 'doc']).optional(),
  categoryId: z.string().uuid().optional(),
});

module.exports = { blockSchema, createPageSchema, updatePageSchema, listPagesQuerySchema };
