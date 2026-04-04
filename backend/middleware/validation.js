const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ success: false, message: errorMessage });
  }
  
  next();
};

// Auth Schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Viewer', 'Analyst').default('Viewer'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Transaction Schemas
const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('Income', 'Expense').required(),
  category: Joi.string().required(),
  date: Joi.date(),
  notes: Joi.string().max(500).allow('', null),
});

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('Viewer', 'Analyst', 'Admin'),
  status: Joi.string().valid('Active', 'Inactive'),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  transactionSchema,
  userSchema
};
