const router = require('express').Router();
const formController = require('../controllers/form.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { createSubmissionSchema } = require('../validators/form.validator');

router.post('/submit', validate({ body: createSubmissionSchema }), formController.submitForm);
router.get('/submissions', authenticate, formController.listSubmissions);

module.exports = router;
