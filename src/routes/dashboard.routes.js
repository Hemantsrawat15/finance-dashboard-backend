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
 *     summary: Get overall financial summary
 *     description: |
 *       Returns a high-level financial summary of the system, including total income, total expenses, and net balance.
 *       This endpoint is designed for dashboard KPI cards and top-level summary panels in reporting interfaces.
 *       It is accessible only to analysts and admins because it exposes aggregated financial intelligence rather than raw transaction browsing alone.
 *       Soft-deleted records should not contribute to the summary totals.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary generated successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because only analysts and admins can access dashboard analytics.
 */
router.get('/summary', ctrl.getSummary);

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     summary: Get totals grouped by category
 *     description: |
 *       Returns aggregated financial totals grouped by category and record type.
 *       This endpoint is useful for category breakdown charts, expense analysis views, and financial composition widgets in a dashboard.
 *       It helps consumers understand where money is coming from and where it is being spent.
 *       Soft-deleted records should be excluded from aggregation results.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category-wise financial totals returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because only analysts and admins can access dashboard analytics.
 */
router.get('/by-category', ctrl.getByCategory);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly income and expense trends
 *     description: |
 *       Returns trend data for the most recent twelve-month period, grouped by month and transaction type.
 *       This endpoint is intended for line charts, trend comparison graphs, and time-series reporting in the dashboard.
 *       It allows analysts and admins to observe patterns in income and expense movement over time.
 *       Soft-deleted records should be excluded from these calculations.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trend analytics returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because only analysts and admins can access dashboard analytics.
 */
router.get('/trends', ctrl.getMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get latest recent transactions
 *     description: |
 *       Returns the most recent financial records, usually limited to the latest ten transactions.
 *       This endpoint is designed for recent activity widgets, dashboard feeds, and quick operational review panels.
 *       It helps analysts and administrators quickly inspect the latest changes entering the system without applying filters manually.
 *       Soft-deleted records should not appear in this result set.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent transactions returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because only analysts and admins can access dashboard analytics.
 */
router.get('/recent', ctrl.getRecent);

module.exports = router;