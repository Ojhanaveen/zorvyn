const Joi = require('joi');

const CATEGORIES = ['Rent', 'EMI', 'Subscription', 'Utility', 'Loan', 'Insurance', 'Other'];
const RECURRENCES = ['One-time', 'Weekly', 'Monthly', 'Yearly'];

const createBillSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid(...CATEGORIES).default('Other'),
  amount: Joi.number().positive().required(),
  nextDueDate: Joi.date().required(),
  recurrence: Joi.string().valid(...RECURRENCES).default('Monthly'),
  totalInstallments: Joi.number().integer().min(1).allow(null),
  reminderDaysBefore: Joi.number().min(0).default(3),
  notes: Joi.string().max(500).allow('', null)
});

const updateBillSchema = Joi.object({
  name: Joi.string(),
  category: Joi.string().valid(...CATEGORIES),
  amount: Joi.number().positive(),
  nextDueDate: Joi.date(),
  recurrence: Joi.string().valid(...RECURRENCES),
  totalInstallments: Joi.number().integer().min(1).allow(null),
  reminderDaysBefore: Joi.number().min(0),
  notes: Joi.string().max(500).allow('', null)
});

module.exports = { createBillSchema, updateBillSchema };
