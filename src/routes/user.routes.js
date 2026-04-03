const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(authenticate);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     description: |
 *       Returns a list of all registered users in the system.
 *       This endpoint is restricted to administrators because it exposes user account data and is intended for user management screens or admin review workflows.
 *       It should be used when the admin needs to inspect available accounts, roles, or account status.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because the authenticated user is not an admin.
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: |
 *       Returns the full details of a single user identified by their unique ID.
 *       This endpoint is admin-only and is typically used in user detail views, admin audit pages, or role/status management interfaces.
 *       It should be used when the admin needs to inspect one specific account in more detail.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique MongoDB ObjectId of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found and returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because the authenticated user is not an admin.
 *       404:
 *         description: No user exists with the provided ID.
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     description: |
 *       Changes the role of an existing user.
 *       This endpoint is restricted to administrators because role changes directly affect authorization and access control across the system.
 *       It is commonly used to promote a viewer to analyst, grant admin access, or downgrade privileges when responsibilities change.
 *       Use this carefully, as it affects what endpoints the target user can access.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique MongoDB ObjectId of the user whose role should be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: New role assignment for the target user.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 description: New system role for the user.
 *                 enum: [viewer, analyst, admin]
 *                 example: analyst
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because the authenticated user is not an admin.
 *       404:
 *         description: No user exists with the provided ID.
 *       422:
 *         description: Validation failed because the supplied role is missing or invalid.
 */
router.patch('/:id/role', userController.updateUserRole);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Activate or deactivate user account
 *     description: |
 *       Updates the active status of a user account.
 *       This endpoint is admin-only and is intended for operational control over who can continue using the system.
 *       Deactivating a user usually prevents future login while preserving account history.
 *       This is useful for suspending access without permanently deleting the user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique MongoDB ObjectId of the user whose status should be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Active state to apply to the user.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: Whether the user account should remain active.
 *                 example: false
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 *       403:
 *         description: Access denied because the authenticated user is not an admin.
 *       404:
 *         description: No user exists with the provided ID.
 *       422:
 *         description: Validation failed because the status payload is missing or invalid.
 */
router.patch('/:id/status', userController.updateUserStatus);

module.exports = router;