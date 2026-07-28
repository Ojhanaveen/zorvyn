const env = require('../../config/env');

// Central error handler: turns ApiError, Joi, and Mongoose errors into a consistent envelope.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.isApiError ? err.statusCode : 500;
  let message = err.message || 'Server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
  }

  if (statusCode === 200) statusCode = 500;

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.nodeEnv === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;
