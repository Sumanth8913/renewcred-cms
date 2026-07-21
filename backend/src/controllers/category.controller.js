const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  ok(res, categories, 'Categories fetched');
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  created(res, category, 'Category created');
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  ok(res, category, 'Category updated');
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  ok(res, null, 'Category deleted');
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
