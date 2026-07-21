const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

async function saveUploadedFile(file) {
  return prisma.media.create({
    data: {
      fileName: file.originalname,
      url: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
    },
  });
}

async function listMedia({ page, limit, search }) {
  const where = search ? { fileName: { contains: search } } : {};
  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

async function deleteMedia(id) {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Media not found');
  await prisma.media.delete({ where: { id } });
}

module.exports = { saveUploadedFile, listMedia, deleteMedia };
