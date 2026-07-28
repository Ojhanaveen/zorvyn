const asyncHandler = require('../../common/asyncHandler');
const ApiResponse = require('../../common/ApiResponse');
const billService = require('./bill.service');

const getBills = asyncHandler(async (req, res) => {
  const bills = await billService.listBills();
  ApiResponse.success(res, 200, bills);
});

const getUpcomingBills = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 7;
  const bills = await billService.listUpcoming(days);
  ApiResponse.success(res, 200, bills);
});

const createBill = asyncHandler(async (req, res) => {
  const bill = await billService.createBill(req.body, req.user);
  ApiResponse.success(res, 201, bill);
});

const updateBill = asyncHandler(async (req, res) => {
  const bill = await billService.updateBill(req.params.id, req.body);
  ApiResponse.success(res, 200, bill);
});

const deleteBill = asyncHandler(async (req, res) => {
  await billService.deleteBill(req.params.id);
  ApiResponse.message(res, 200, 'Bill removed');
});

const payBill = asyncHandler(async (req, res) => {
  const bill = await billService.markPaid(req.params.id, req.user);
  ApiResponse.success(res, 200, bill);
});

module.exports = { getBills, getUpcomingBills, createBill, updateBill, deleteBill, payBill };
