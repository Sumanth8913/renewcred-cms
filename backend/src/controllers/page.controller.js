const pageService = require('../services/page.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');

const listPages = asyncHandler(async (req, res) => {
  const result = await pageService.listPages(req.query);
  ok(res, result, 'Pages fetched');
});

const getPage = asyncHandler(async (req, res) => {
  const page = await pageService.getPageById(req.params.id);
  ok(res, page, 'Page fetched');
});

const getPublicPageBySlug = asyncHandler(async (req, res) => {
  const page = await pageService.getPublishedPageBySlug(req.params.slug);
  ok(res, page, 'Page fetched');
});

const createPage = asyncHandler(async (req, res) => {
  const page = await pageService.createPage(req.body, req.admin.id);
  created(res, page, 'Page created');
});

const updatePage = asyncHandler(async (req, res) => {
  const page = await pageService.updatePage(req.params.id, req.body, req.admin.id);
  ok(res, page, 'Page updated');
});

const deletePage = asyncHandler(async (req, res) => {
  await pageService.deletePage(req.params.id, req.admin.id);
  ok(res, null, 'Page deleted');
});

const duplicatePage = asyncHandler(async (req, res) => {
  const page = await pageService.duplicatePage(req.params.id, req.admin.id);
  created(res, page, 'Page duplicated');
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await pageService.getDashboardStats();
  ok(res, stats, 'Dashboard stats fetched');
});

module.exports = {
  listPages,
  getPage,
  getPublicPageBySlug,
  createPage,
  updatePage,
  deletePage,
  duplicatePage,
  getDashboardStats,
};
