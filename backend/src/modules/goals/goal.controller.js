const asyncHandler = require('../../common/asyncHandler');
const ApiResponse = require('../../common/ApiResponse');
const goalService = require('./goal.service');

const getGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.listGoals();
  ApiResponse.success(res, 200, goals);
});

const createGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.createGoal(req.body, req.user);
  ApiResponse.success(res, 201, goal);
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.updateGoal(req.params.id, req.body);
  ApiResponse.success(res, 200, goal);
});

const deleteGoal = asyncHandler(async (req, res) => {
  await goalService.deleteGoal(req.params.id);
  ApiResponse.message(res, 200, 'Goal removed');
});

const contributeToGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.contribute(req.params.id, req.body.amount, req.user);
  ApiResponse.success(res, 200, goal);
});

module.exports = { getGoals, createGoal, updateGoal, deleteGoal, contributeToGoal };
