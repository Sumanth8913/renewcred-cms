const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Verifies the Bearer token and attaches the decoded admin claims to req.admin.
const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No authentication token provided');
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded;
    next();
  } catch (err) {
    throw ApiError.forbidden('Invalid or expired token');
  }
});

// Restricts a route to a set of roles, e.g. authorize('ADMIN', 'EDITOR').
const authorize = (...roles) => (req, res, next) => {
  if (!req.admin) {
    throw ApiError.unauthorized();
  }
  if (roles.length && !roles.includes(req.admin.role)) {
    throw ApiError.forbidden('You do not have permission to perform this action');
  }
  next();
};

module.exports = { authenticate, authorize };
