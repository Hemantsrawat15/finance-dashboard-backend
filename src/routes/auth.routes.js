const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate, registerSchema, loginSchema } = require('../validators/auth.validator');
const { authenticate } = require('../middleware/auth');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

router.get('/me', authenticate, authController.getMe);

module.exports = router;