const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

async function login(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  await prisma.auditLog.create({
    data: { adminId: admin.id, action: 'LOGIN' },
  });

  const { passwordHash, ...safeAdmin } = admin;
  return { token, admin: safeAdmin };
}

async function getProfile(adminId) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) throw ApiError.notFound('Admin not found');
  const { passwordHash, ...safeAdmin } = admin;
  return safeAdmin;
}

module.exports = { login, getProfile };
