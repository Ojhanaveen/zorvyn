const ApiError = require('../../common/ApiError');
const goalRepository = require('./goal.repository');
const Transaction = require('../transactions/transaction.model');

const listGoals = () => goalRepository.findAllSorted();

const createGoal = (body, user) => goalRepository.create({ ...body, createdBy: user._id });

const updateGoal = async (id, body) => {
  const existing = await goalRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Goal not found');
  }
  return goalRepository.updateById(id, body);
};

const deleteGoal = async (id) => {
  const existing = await goalRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('Goal not found');
  }
  await goalRepository.deleteById(id);
};

const contribute = async (id, amount, user) => {
  const goal = await goalRepository.findById(id);
  if (!goal) {
    throw ApiError.notFound('Goal not found');
  }
  if (goal.status === 'Completed') {
    throw ApiError.badRequest('Goal is already completed');
  }

  const currentAmount = goal.currentAmount + amount;
  const status = currentAmount >= goal.targetAmount ? 'Completed' : 'Active';

  await Transaction.create({
    amount,
    type: 'Expense',
    category: `Savings: ${goal.name}`,
    date: new Date(),
    notes: `Contribution towards goal "${goal.name}"`,
    createdBy: user._id
  });

  return goalRepository.updateById(id, { currentAmount, status });
};

module.exports = { listGoals, createGoal, updateGoal, deleteGoal, contribute };
