const { z } = require('zod');

const createSubmissionSchema = z.object({
  formType: z.enum(['buyer', 'supplier', 'contact', 'newsletter']),
  payload: z.record(z.any()),
});

module.exports = { createSubmissionSchema };
