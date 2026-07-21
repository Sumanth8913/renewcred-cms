const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

// Public read (site needs categories to render the Standards listing)
router.get('/', categoryController.listCategories);

router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate({ body: createCategorySchema }),
  categoryController.createCategory
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate({ body: updateCategorySchema }),
  categoryController.updateCategory
);
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.deleteCategory);

module.exports = router;
