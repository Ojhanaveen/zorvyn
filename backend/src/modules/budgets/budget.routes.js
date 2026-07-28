const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('./budget.controller');
const { protect, authorize } = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const { createBudgetSchema, updateBudgetSchema } = require('./budget.validation');

router.use(protect);

router.get('/', authorize('Analyst', 'Admin'), getBudgets);
router.post('/', authorize('Admin'), validate(createBudgetSchema), createBudget);
router.put('/:id', authorize('Admin'), validate(updateBudgetSchema), updateBudget);
router.delete('/:id', authorize('Admin'), deleteBudget);

module.exports = router;
