const asyncHandler = require('../../common/asyncHandler');
const ApiResponse = require('../../common/ApiResponse');
const transactionService = require('./transaction.service');

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.listTransactions(req.query, req.user);
  ApiResponse.success(res, 200, transactions, { count: transactions.length });
});

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.body, req.user);
  ApiResponse.success(res, 201, transaction);
});

const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(req.params.id, req.body, req.user);
  ApiResponse.success(res, 200, transaction);
});

const deleteTransaction = asyncHandler(async (req, res) => {
  await transactionService.deleteTransaction(req.params.id, req.user);
  ApiResponse.message(res, 200, 'Transaction removed');
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await transactionService.getDashboardSummary();
  ApiResponse.success(res, 200, data);
});

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary
};
