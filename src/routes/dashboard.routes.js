const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const ctrl = require('../controllers/dashboard.controller');

router.use(authenticate);
router.use(authorize('analyst', 'admin'));

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance (Analyst/Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/summary', ctrl.getSummary);

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     summary: Get spending breakdown by category (Analyst/Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/by-category', ctrl.getByCategory);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get last 12 months income vs expense trends (Analyst/Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trend data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/trends', ctrl.getMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get last 10 transactions (Analyst/Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent transactions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/recent', ctrl.getRecent);

module.exports = router;