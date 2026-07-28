const asyncHandler = require('../../common/asyncHandler');
const ApiResponse = require('../../common/ApiResponse');
const budgetService = require('./budget.service');

const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await budgetService.listBudgets();
  ApiResponse.success(res, 200, budgets);
});

const createBudget = asyncHandler(async (req, res) => {
  const budget = await budgetService.createBudget(req.body, req.user);
  ApiResponse.success(res, 201, budget);
});

const updateBudget = asyncHandler(async (req, res) => {
  const budget = await budgetService.updateBudget(req.params.id, req.body);
  ApiResponse.success(res, 200, budget);
});

const deleteBudget = asyncHandler(async (req, res) => {
  await budgetService.deleteBudget(req.params.id);
  ApiResponse.message(res, 200, 'Budget removed');
});

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
