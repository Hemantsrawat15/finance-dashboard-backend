const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.updateUserStatus);

module.exports = router;