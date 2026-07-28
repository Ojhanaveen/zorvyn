const ApiError = require('../../common/ApiError');
const budgetRepository = require('./budget.repository');
const transactionRepository = require('../transactions/transaction.repository');

const startOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// Computes current-month spend per category and flags budgets that are near/over their limit.
// Used both by the dedicated /api/budgets endpoint and folded into the dashboard summary.
const computeAlerts = async () => {
  const budgets = await budgetRepository.findAllSorted();
  if (budgets.length === 0) return [];

  const spendRows = await transactionRepository.spendByCategorySince(startOfMonth(), 'Expense');
  const spendByCategory = spendRows.reduce((acc, row) => {
    acc[row._id] = row.total;
    return acc;
  }, {});

  return budgets.map((budget) => {
    const spent = spendByCategory[budget.category] || 0;
    const percentUsed = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;

    let status = 'On Track';
    if (percentUsed >= 100) status = 'Exceeded';
    else if (percentUsed >= budget.alertThresholdPercent) status = 'Warning';

    return {
      _id: budget._id,
      category: budget.category,
      monthlyLimit: budget.monthlyLimit,
      alertThresholdPercent: budget.alertThresholdPercent,
      spent,
      percentUsed: Math.round(percentUsed * 10) / 10,
      status
    };
  });
};

const listBudgets = () => computeAlerts();

const createBudget = async (body, user) => {
  const existing = await budgetRepository.findByCategory(body.category);
  if (existing) {
    throw ApiError.badRequest(`A budget for "${body.category}" already exists`);
  }
  return budgetRepository.create({ ...body, createdBy: user._id });
};

const updateBudget = async (id, body) => {
  const existing = await budgetRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Budget not found');
  }
  return budgetRepository.updateById(id, body);
};

const deleteBudget = async (id) => {
  const existing = await budgetRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Budget not found');
  }
  await budgetRepository.deleteById(id);
};

module.exports = { listBudgets, createBudget, updateBudget, deleteBudget, computeAlerts };
