const slugify = require('slugify');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  // Loop instead of a single query because collisions are rare but must
  // still resolve deterministically (renewcred-standards, -2, -3, ...).
  while (true) {
    const existing = await prisma.page.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${counter++}`;
  }
}

async function listPages({ page, limit, search, status, pageType, categoryId }) {
  const where = {
    ...(status && { status }),
    ...(pageType && { pageType }),
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { slug: { contains: search } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.page.findMany({
      where,
      include: { category: true, author: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.page.count({ where }),
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

async function getPageById(id) {
  const page = await prisma.page.findUnique({
    where: { id },
    include: { category: true, author: { select: { id: true, name: true } } },
  });
  if (!page) throw ApiError.notFound('Page not found');
  return page;
}

async function getPublishedPageBySlug(slug) {
  const page = await prisma.page.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { category: true },
  });
  if (!page) throw ApiError.notFound('Page not found');
  return page;
}

async function createPage(data, authorId) {
  const slug = data.slug ? data.slug : await generateUniqueSlug(data.title);

  const page = await prisma.page.create({
    data: { ...data, slug, authorId },
  });

  await prisma.auditLog.create({
    data: { adminId: authorId, action: 'CREATE_PAGE', entity: 'Page', entityId: page.id },
  });

  return page;
}

async function updatePage(id, data, adminId) {
  await getPageById(id); // 404s if missing

  const updateData = { ...data };
  if (data.title && !data.slug) {
    updateData.slug = await generateUniqueSlug(data.title, id);
  }

  const page = await prisma.page.update({ where: { id }, data: updateData });

  await prisma.auditLog.create({
    data: { adminId, action: 'UPDATE_PAGE', entity: 'Page', entityId: page.id },
  });

  return page;
}

async function deletePage(id, adminId) {
  await getPageById(id);
  await prisma.page.delete({ where: { id } });
  await prisma.auditLog.create({
    data: { adminId, action: 'DELETE_PAGE', entity: 'Page', entityId: id },
  });
}

async function duplicatePage(id, adminId) {
  const original = await getPageById(id);
  const slug = await generateUniqueSlug(`${original.title} copy`);

  const copy = await prisma.page.create({
    data: {
      title: `${original.title} (Copy)`,
      slug,
      pageType: original.pageType,
      excerpt: original.excerpt,
      blocks: original.blocks,
      status: 'DRAFT',
      version: original.version,
      metaTitle: original.metaTitle,
      metaDescription: original.metaDescription,
      ogImage: original.ogImage,
      categoryId: original.categoryId,
      authorId: adminId,
    },
  });

  return copy;
}

async function getDashboardStats() {
  const [total, published, draft, archived, categories, media] = await Promise.all([
    prisma.page.count(),
    prisma.page.count({ where: { status: 'PUBLISHED' } }),
    prisma.page.count({ where: { status: 'DRAFT' } }),
    prisma.page.count({ where: { status: 'ARCHIVED' } }),
    prisma.category.count(),
    prisma.media.count(),
  ]);

  const recentPages = await prisma.page.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: { id: true, title: true, slug: true, status: true, updatedAt: true },
  });

  const newsletterCount = await prisma.formSubmission.count({ where: { formType: 'newsletter' } });
  const submissionCount = await prisma.formSubmission.count({
    where: { formType: { in: ['buyer', 'supplier', 'contact'] } },
  });

  return {
    totalPages: total,
    publishedPages: published,
    draftPages: draft,
    archivedPages: archived,
    totalCategories: categories,
    totalMedia: media,
    newsletterSubscribers: newsletterCount,
    formSubmissions: submissionCount,
    recentPages,
  };
}

module.exports = {
  listPages,
  getPageById,
  getPublishedPageBySlug,
  createPage,
  updatePage,
  deletePage,
  duplicatePage,
  getDashboardStats,
};
