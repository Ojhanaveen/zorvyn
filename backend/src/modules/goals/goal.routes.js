const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  contributeToGoal
} = require('./goal.controller');
const { protect, authorize } = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const { createGoalSchema, updateGoalSchema, contributeSchema } = require('./goal.validation');

router.use(protect);

router.get('/', authorize('Analyst', 'Admin'), getGoals);
router.post('/', authorize('Admin'), validate(createGoalSchema), createGoal);
router.put('/:id', authorize('Admin'), validate(updateGoalSchema), updateGoal);
router.delete('/:id', authorize('Admin'), deleteGoal);
router.post('/:id/contribute', authorize('Analyst', 'Admin'), validate(contributeSchema), contributeToGoal);

module.exports = router;
