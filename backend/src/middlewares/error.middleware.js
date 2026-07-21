const ApiError = require('../utils/ApiError');
const { nodeEnv } = require('../config/env');

// 404 handler for unmatched routes — must be registered after all routes.
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Single place where every thrown error becomes a consistent JSON response.
// Never leaks stack traces once NODE_ENV=production.
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  // Prisma unique-constraint violation
  if (err.code === 'P2002') {
    statusCode = 409;
    // message = `A record with this ${err.meta?.target?.join(', ') || 'value'} already exists`;
const target = Array.isArray(err.meta?.target)
  ? err.meta.target.join(', ')
  : err.meta?.target || 'value';

message = `A record with this ${target} already exists`;

  }
  // Prisma record-not-found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (statusCode === 500) {
    console.error('[UNHANDLED ERROR]', err);
    if (nodeEnv === 'production') {
      message = 'Internal server error';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
    ...(nodeEnv !== 'production' && statusCode === 500 ? { stack: err.stack } : {}),
  });
}

module.exports = { notFoundHandler, errorHandler };
