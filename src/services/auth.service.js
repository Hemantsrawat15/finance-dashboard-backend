const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw { status: 409, message: 'Email is already in use' };
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) {
    throw { status: 401, message: 'Invalid credentials or inactive account' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
};

module.exports = { register, login, getMe };