const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ApiError = require('../../common/ApiError');
const userRepository = require('../users/user.repository');

const generateToken = (id) => jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const login = async ({ email, password, role }) => {
  const user = await userRepository.findByEmail(email, true);

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (role && user.role !== role) {
    throw ApiError.unauthorized(`Unauthorized login: You are registered as ${user.role}, not ${role}.`);
  }

  if (user.status === 'Inactive') {
    throw new ApiError(403, 'Your account is inactive');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

const register = async ({ name, email, password, role }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw ApiError.badRequest('User already exists');
  }

  if (role === 'Admin') {
    throw ApiError.forbidden('Admin registration is restricted');
  }

  const user = await userRepository.create({
    name,
    email,
    password,
    role: role || 'Viewer',
    status: 'Active'
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user.toSafeJSON();
};

module.exports = { login, register, getProfile };
