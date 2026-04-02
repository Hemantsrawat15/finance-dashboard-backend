const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const ctrl = require('../controllers/record.controller');
const { validate, createRecordSchema, updateRecordSchema } = require('../validators/record.validator');

router.get('/', authenticate, ctrl.getAll);
router.get('/:id', authenticate, ctrl.getOne);

router.post('/', authenticate, authorize('admin'), validate(createRecordSchema), ctrl.create);
router.patch('/:id', authenticate, authorize('admin'), validate(updateRecordSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;