const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary
} = require('./transaction.controller');
const { protect, authorize } = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const { transactionSchema, updateTransactionSchema } = require('./transaction.validation');

router.use(protect);

router.get('/', authorize('Viewer', 'Analyst', 'Admin'), getTransactions);
router.get('/summary', authorize('Viewer', 'Analyst', 'Admin'), getDashboardSummary);
router.post('/', authorize('Analyst', 'Admin'), validate(transactionSchema), createTransaction);
router.put('/:id', authorize('Admin'), validate(updateTransactionSchema), updateTransaction);
router.delete('/:id', authorize('Admin'), deleteTransaction);

module.exports = router;
