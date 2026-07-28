const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Viewer', 'Analyst', 'Admin').default('Viewer'),
  status: Joi.string().valid('Active', 'Inactive').default('Active')
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('Viewer', 'Analyst', 'Admin'),
  status: Joi.string().valid('Active', 'Inactive')
});

module.exports = { createUserSchema, updateUserSchema };
