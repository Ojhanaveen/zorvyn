const ApiError = require('../../common/ApiError');
const transactionRepository = require('./transaction.repository');
const budgetService = require('../budgets/budget.service');

const buildFilterQuery = ({ startDate, endDate, category, type, search }) => {
  const query = {};

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (type) query.type = type;
  if (category) query.category = category;

  if (search) {
    query.$or = [
      { category: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } }
    ];
  }

  return query;
};

const listTransactions = async (filters, user) => {
  if (user.role === 'Viewer') {
    throw ApiError.forbidden('Forbidden: Viewers are only authorized to see the Dashboard Overview.');
  }
  const query = buildFilterQuery(filters);
  return transactionRepository.findWithFilters(query);
};

const createTransaction = async (body, user) => {
  const { amount, type, category, date, notes } = body;
  return transactionRepository.create({ amount, type, category, date, notes, createdBy: user._id });
};

const updateTransaction = async (id, body, user) => {
  if (user.role !== 'Admin') {
    throw ApiError.forbidden('Forbidden: Analysts and Viewers cannot edit records.');
  }

  const existing = await transactionRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Transaction not found');
  }

  return transactionRepository.updateById(id, body);
};

const deleteTransaction = async (id, user) => {
  if (user.role !== 'Admin') {
    throw ApiError.forbidden('Forbidden: Only Administrators can remove records.');
  }

  const existing = await transactionRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Transaction not found');
  }

  await transactionRepository.deleteById(id);
};

const getDashboardSummary = async () => {
  const stats = await transactionRepository.totalsByType();

  const summary = { income: 0, expense: 0, balance: 0 };
  stats.forEach((stat) => {
    if (stat._id === 'Income') summary.income = stat.total;
    if (stat._id === 'Expense') summary.expense = stat.total;
  });
  summary.balance = summary.income - summary.expense;

  const categoryBreakdown = await transactionRepository.categoryBreakdown();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyTrends = await transactionRepository.monthlyTrends(sixMonthsAgo);

  const recentActivity = await transactionRepository.recentActivity(5);

  const budgetAlerts = await budgetService.computeAlerts();

  return { summary, categoryBreakdown, monthlyTrends, recentActivity, budgetAlerts };
};

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary
};
