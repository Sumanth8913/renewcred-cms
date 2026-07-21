const formService = require('../services/form.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');

const submitForm = asyncHandler(async (req, res) => {
  const { formType, payload } = req.body;
  const submission = await formService.createSubmission(formType, payload);
  created(res, submission, 'Submission received');
});

const listSubmissions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const result = await formService.listSubmissions({ page, limit, formType: req.query.formType });
  ok(res, result, 'Submissions fetched');
});

module.exports = { submitForm, listSubmissions };
