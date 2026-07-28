const Joi = require('joi');

const createGoalSchema = Joi.object({
  name: Joi.string().required(),
  targetAmount: Joi.number().positive().required(),
  targetDate: Joi.date().allow(null)
});

const updateGoalSchema = Joi.object({
  name: Joi.string(),
  targetAmount: Joi.number().positive(),
  targetDate: Joi.date().allow(null)
});

const contributeSchema = Joi.object({
  amount: Joi.number().positive().required()
});

module.exports = { createGoalSchema, updateGoalSchema, contributeSchema };
