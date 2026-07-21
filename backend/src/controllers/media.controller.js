const mediaService = require('../services/media.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');
const ApiError = require('../utils/ApiError');

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  const media = await mediaService.saveUploadedFile(req.file);
  created(res, media, 'File uploaded');
});

const listMedia = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '24', 10);
  const result = await mediaService.listMedia({ page, limit, search: req.query.search });
  ok(res, result, 'Media fetched');
});

const deleteMedia = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id);
  ok(res, null, 'Media deleted');
});

module.exports = { uploadMedia, listMedia, deleteMedia };
