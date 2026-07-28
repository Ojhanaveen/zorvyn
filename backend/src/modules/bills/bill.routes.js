const express = require('express');
const router = express.Router();
const {
  getBills,
  getUpcomingBills,
  createBill,
  updateBill,
  deleteBill,
  payBill
} = require('./bill.controller');
const { protect, authorize } = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const { createBillSchema, updateBillSchema } = require('./bill.validation');

router.use(protect);

router.get('/', authorize('Analyst', 'Admin'), getBills);
router.get('/upcoming', authorize('Analyst', 'Admin'), getUpcomingBills);
router.post('/', authorize('Admin'), validate(createBillSchema), createBill);
router.put('/:id', authorize('Admin'), validate(updateBillSchema), updateBill);
router.delete('/:id', authorize('Admin'), deleteBill);
router.put('/:id/pay', authorize('Admin'), payBill);

module.exports = router;
