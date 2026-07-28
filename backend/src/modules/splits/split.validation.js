const Joi = require('joi');

const participantSchema = Joi.object({
  user: Joi.string().required(),
  share: Joi.number().min(0).required()
});

const createSplitSchema = Joi.object({
  description: Joi.string().required(),
  totalAmount: Joi.number().positive().required(),
  category: Joi.string().default('Shared'),
  date: Joi.date(),
  paidBy: Joi.string().required(),
  participants: Joi.array().items(participantSchema).min(1).required()
});

module.exports = { createSplitSchema };
