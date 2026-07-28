const Joi = require('joi');

const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('Income', 'Expense').required(),
  category: Joi.string().required(),
  date: Joi.date(),
  notes: Joi.string().max(500).allow('', null)
});

const updateTransactionSchema = Joi.object({
  amount: Joi.number().positive(),
  type: Joi.string().valid('Income', 'Expense'),
  category: Joi.string(),
  date: Joi.date(),
  notes: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('Pending', 'Completed', 'Flagged')
});

module.exports = { transactionSchema, updateTransactionSchema };
