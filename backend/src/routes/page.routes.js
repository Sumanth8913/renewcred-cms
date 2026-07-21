const router = require('express').Router();
const pageController = require('../controllers/page.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  createPageSchema,
  updatePageSchema,
  listPagesQuerySchema,
} = require('../validators/page.validator');

// ---- Public (read-only, published content only) ----
router.get('/public/slug/:slug', pageController.getPublicPageBySlug);

// ---- Admin (protected) ----
router.get('/dashboard/stats', authenticate, pageController.getDashboardStats);

router.get('/', authenticate, validate({ query: listPagesQuerySchema }), pageController.listPages);
router.get('/:id', authenticate, pageController.getPage);
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate({ body: createPageSchema }),
  pageController.createPage
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate({ body: updatePageSchema }),
  pageController.updatePage
);
router.post('/:id/duplicate', authenticate, authorize('ADMIN', 'EDITOR'), pageController.duplicatePage);
router.delete('/:id', authenticate, authorize('ADMIN'), pageController.deletePage);

module.exports = router;
