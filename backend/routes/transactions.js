const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardSummary
} = require('../controllers/transactions');
const { protect, authorize } = require('../middleware/auth');
const { validate, transactionSchema } = require('../middleware/validation');

// Apply protection to all routes
router.use(protect);

// Viewer, Analyst, Admin can view transactions
router.get('/', authorize('Viewer', 'Analyst', 'Admin'), getTransactions);

// Viewer, Analyst, Admin can view summary stats
router.get('/summary', authorize('Viewer', 'Analyst', 'Admin'), getDashboardSummary);
router.post('/', authorize('Analyst', 'Admin'), validate(transactionSchema), createTransaction);

// Only Admin can update or delete transactions
router.put('/:id', authorize('Admin'), updateTransaction);
router.delete('/:id', authorize('Admin'), deleteTransaction);

module.exports = router;
