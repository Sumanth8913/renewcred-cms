const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/pages', require('./page.routes'));
router.use('/categories', require('./category.routes'));
router.use('/media', require('./media.routes'));
router.use('/forms', require('./form.routes'));

module.exports = router;
