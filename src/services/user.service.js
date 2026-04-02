const User = require('../models/User');

const getAllUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
};

const updateUserRole = async (id, role) => {
  const validRoles = ['viewer', 'analyst', 'admin'];
  if (!validRoles.includes(role)) {
    throw { status: 400, message: 'Invalid role' };
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );
  
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
};

const updateUserStatus = async (id, isActive) => {
  if (typeof isActive !== 'boolean') {
    throw { status: 400, message: 'isActive must be a boolean' };
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );

  if (!user) throw { status: 404, message: 'User not found' };
  return user;
};

module.exports = { getAllUsers, getUserById, updateUserRole, updateUserStatus };