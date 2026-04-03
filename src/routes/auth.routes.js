const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate, registerSchema, loginSchema } = require('../validators/auth.validator');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: |
 *       Creates a new user account in the finance dashboard system.
 *       This endpoint is public and does not require authentication.
 *       By default, new users are typically created with the lowest privilege level unless a role is explicitly allowed by your backend logic.
 *       Passwords are hashed before storage, and duplicate email addresses are rejected.
 *       Use this endpoint when onboarding a new user who needs access to the platform.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: New user registration details.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Unique email address used for login.
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: Plain-text password that will be hashed before saving.
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: Optional role, if your backend permits role assignment during registration.
 *                 enum: [viewer, analyst, admin]
 *                 example: viewer
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       409:
 *         description: A user with the same email already exists.
 *       422:
 *         description: Validation failed because one or more required fields are missing or invalid.
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and issue JWT token
 *     description: |
 *       Authenticates a user using email and password and returns a signed JWT token on success.
 *       This token must be supplied in the Authorization header as `Bearer <token>` when calling protected routes.
 *       Only active users with valid credentials can log in.
 *       Use this endpoint first before testing any authenticated Swagger endpoint.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Login credentials for an existing user.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Registered user email.
 *                 example: admin@finance.com
 *               password:
 *                 type: string
 *                 description: User password.
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful and JWT token returned.
 *       401:
 *         description: Invalid credentials, inactive user, or authentication failure.
 *       422:
 *         description: Validation failed because email or password is missing or malformed.
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     description: |
 *       Returns the profile of the currently authenticated user based on the JWT token provided in the Authorization header.
 *       This endpoint is useful for verifying that authentication is working correctly and for loading the current user's identity, role, and account details after login.
 *       Any authenticated role can access this endpoint.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user profile returned successfully.
 *       401:
 *         description: No token provided, invalid token, or expired token.
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;