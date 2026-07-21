const prisma = require('../config/prisma');

async function createSubmission(formType, payload) {
  return prisma.formSubmission.create({ data: { formType, payload } });
}

async function listSubmissions({ page, limit, formType }) {
  const where = formType ? { formType } : {};
  const [items, total] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.formSubmission.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

module.exports = { createSubmission, listSubmissions };
