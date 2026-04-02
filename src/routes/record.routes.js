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
 *     summary: Get all financial records (with filters)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           example: "2026-01-01"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           example: "2026-03-31"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of records with pagination
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, ctrl.getAll);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get single financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Record not found
 */
router.get('/:id', authenticate, ctrl.getOne);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a financial record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 example: "2026-03-01"
 *               description:
 *                 type: string
 *                 example: March salary
 *     responses:
 *       201:
 *         description: Record created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       422:
 *         description: Validation error
 */
router.post('/', authenticate, authorize('admin'), validate(createRecordSchema), ctrl.create);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update a financial record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Record ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 55000
 *               description:
 *                 type: string
 *                 example: Updated salary
 *     responses:
 *       200:
 *         description: Record updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Record not found
 *       422:
 *         description: Validation error
 */
router.patch('/:id', authenticate, authorize('admin'), validate(updateRecordSchema), ctrl.update);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record soft deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;