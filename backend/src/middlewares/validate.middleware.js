const ApiError = require('../utils/ApiError');

// Usage: validate({ body: loginSchema }) or validate({ query: listPagesSchema })
// Runs the relevant zod schema against req[part] and throws a 400 with
// field-level messages on failure — nothing malformed reaches the service layer.
const validate = (schemas) => (req, res, next) => {
  for (const part of ['body', 'query', 'params']) {
    const schema = schemas[part];
    if (!schema) continue;

    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }
    req[part] = result.data;
  }
  next();
};

module.exports = validate;
