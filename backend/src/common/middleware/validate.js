const ApiError = require('../ApiError');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    throw ApiError.badRequest(errorMessage);
  }

  req.body = value;
  next();
};

module.exports = validate;
