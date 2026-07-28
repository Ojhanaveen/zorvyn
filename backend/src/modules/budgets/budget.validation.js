const Joi = require('joi');

const createBudgetSchema = Joi.object({
  category: Joi.string().required(),
  monthlyLimit: Joi.number().positive().required(),
  alertThresholdPercent: Joi.number().min(1).max(100).default(80)
});

const updateBudgetSchema = Joi.object({
  category: Joi.string(),
  monthlyLimit: Joi.number().positive(),
  alertThresholdPercent: Joi.number().min(1).max(100)
});

module.exports = { createBudgetSchema, updateBudgetSchema };
