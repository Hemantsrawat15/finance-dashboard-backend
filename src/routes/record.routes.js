const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const ctrl = require('../controllers/record.controller');
const { validate, createRecordSchema, updateRecordSchema } = require('../validators/record.validator');

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get paginated financial records
 *     description: |
 *       Returns a paginated list of financial records visible to authenticated users.
 *       Supports optional filtering by transaction type, category, and date range.
 *       Soft-deleted records are excluded automatically by the application data layer.
 *       This endpoint is useful for transaction listing pages, filtered search views, reporting screens, and finance history review.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         description: Filter records by transaction type.
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         required: false
 *         description: Filter records by category name such as Salary, Rent, Food, or Travel.
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         required: false
 *         description: Start date for filtering records, inclusive.
 *         schema:
 *           type: string
 *           example: "2026-01-01"
 *       - in: query
 *         name: to
 *         required: false
 *         description: End date for filtering records, inclusive.
 *         schema:
 *           type: string
 *           example: "2026-03-31"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination. Defaults to 1 if not provided.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of records per page. Defaults to 10 if not provided.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Financial records returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 */
router.get('/', authenticate, ctrl.getAll);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get single financial record
 *     description: |
 *       Returns one financial record by its unique identifier.
 *       Any authenticated user can access this endpoint if they are allowed into the system.
 *       This is typically used for record detail pages, audit views, or fetching one transaction before an edit operation.
 *       If the record does not exist or has already been removed from active results, a 404 response should be returned.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique MongoDB ObjectId of the financial record.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Financial record returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       404:
 *         description: No financial record exists with the provided ID.
 */
router.get('/:id', authenticate, ctrl.getOne);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create new financial record
 *     description: |
 *       Creates a new financial record such as an income entry or expense transaction.
 *       This endpoint is restricted to administrators to maintain strict control over creation of financial data.
 *       The request must include amount, type, category, and date, while description is optional.
 *       The created record is associated with the authenticated user performing the action.
 *       Use this endpoint for adding transactions that should appear in reports, listings, and dashboard analytics.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Financial record details to be created.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Monetary amount of the transaction.
 *                 example: 50000
 *               type:
 *                 type: string
 *                 description: Whether the record is an income or expense entry.
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 description: Category used for reporting and grouping.
 *                 example: Salary
 *               date:
 *                 type: string
 *                 description: Date on which the financial activity occurred.
 *                 example: "2026-03-01"
 *               description:
 *                 type: string
 *                 description: Optional note describing the transaction.
 *                 example: March salary credited
 *     responses:
 *       201:
 *         description: Financial record created successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because only admins can create records.
 *       422:
 *         description: Validation failed because one or more required record fields are missing or invalid.
 */
router.post('/', authenticate, authorize('admin'), validate(createRecordSchema), ctrl.create);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update existing financial record
 *     description: |
 *       Updates an existing financial record by ID.
 *       This endpoint is restricted to administrators because modifying financial data affects reports, summaries, and transaction history.
 *       Use this endpoint to correct transaction amounts, update descriptions, or adjust record details after creation.
 *       Only supplied fields are updated, and validation should still be enforced on allowed values.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique MongoDB ObjectId of the financial record to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: One or more updatable fields for the financial record.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Updated monetary amount.
 *                 example: 55000
 *               type:
 *                 type: string
 *                 description: Updated record type.
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 description: Updated reporting category.
 *                 example: Rent
 *               date:
 *                 type: string
 *                 description: Updated transaction date.
 *                 example: "2026-03-05"
 *               description:
 *                 type: string
 *                 description: Updated narrative or note for the transaction.
 *                 example: Corrected payroll entry
 *     responses:
 *       200:
 *         description: Financial record updated successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because only admins can update records.
 *       404:
 *         description: No financial record exists with the provided ID.
 *       422:
 *         description: Validation failed because one or more updated fields are invalid.
 */
router.patch('/:id', authenticate, authorize('admin'), validate(updateRecordSchema), ctrl.update);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete financial record
 *     description: |
 *       Soft deletes a financial record instead of permanently removing it from the database.
 *       This means the record is marked as deleted and excluded from normal queries, but can still exist for audit and historical integrity purposes.
 *       This endpoint is restricted to administrators because deleting financial data is a sensitive operation.
 *       Use this endpoint when a transaction should no longer appear in active listings or dashboard calculations.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique MongoDB ObjectId of the financial record to soft delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Financial record soft deleted successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because only admins can delete records.
 *       404:
 *         description: No financial record exists with the provided ID.
 */
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;