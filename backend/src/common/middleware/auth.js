const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ApiError = require('../ApiError');
const asyncHandler = require('../asyncHandler');
const User = require('../../modules/users/user.model');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized, no token');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw ApiError.unauthorized('Not authorized, token failed');
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw ApiError.unauthorized('User not found');
  }
  if (user.status === 'Inactive') {
    throw ApiError.forbidden('User account is inactive');
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw ApiError.forbidden(`User role ${req.user.role} is not authorized to access this route`);
  }
  next();
};

module.exports = { protect, authorize };
