const router = require('express').Router();
const mediaController = require('../controllers/media.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const upload = require('../config/upload');

router.get('/', authenticate, mediaController.listMedia);
router.post('/upload', authenticate, authorize('ADMIN', 'EDITOR'), upload.single('file'), mediaController.uploadMedia);
router.delete('/:id', authenticate, authorize('ADMIN'), mediaController.deleteMedia);

module.exports = router;
