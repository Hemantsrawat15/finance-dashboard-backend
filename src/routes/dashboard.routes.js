const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const ctrl = require('../controllers/dashboard.controller');

router.use(authenticate);
router.use(authorize('analyst', 'admin'));

router.get('/summary', ctrl.getSummary);
router.get('/by-category', ctrl.getByCategory);
router.get('/trends', ctrl.getMonthlyTrends);
router.get('/recent', ctrl.getRecent);

module.exports = router;