const userService = require('../services/user.service');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await userService.updateUserRole(req.params.id, role);
    res.status(200).json({ success: true, message: 'Role updated successfully', data: user });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await userService.updateUserStatus(req.params.id, isActive);
    res.status(200).json({ success: true, message: 'Status updated successfully', data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, updateUserStatus };