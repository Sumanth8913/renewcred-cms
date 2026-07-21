const slugify = require('slugify');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function listCategories() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { pages: true } } },
  });
}

async function createCategory(data) {
  const slug = data.slug || slugify(data.name, { lower: true, strict: true });
  return prisma.category.create({ data: { ...data, slug } });
}

async function updateCategory(id, data) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Category not found');
  return prisma.category.update({ where: { id }, data });
}

async function deleteCategory(id) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Category not found');
  await prisma.category.delete({ where: { id } });
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
