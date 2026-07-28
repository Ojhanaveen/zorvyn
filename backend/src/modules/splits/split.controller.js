const asyncHandler = require('../../common/asyncHandler');
const ApiResponse = require('../../common/ApiResponse');
const splitService = require('./split.service');

const getAllSplits = asyncHandler(async (req, res) => {
  const splits = await splitService.listAll();
  ApiResponse.success(res, 200, splits);
});

const getMySplits = asyncHandler(async (req, res) => {
  const splits = await splitService.listMine(req.user._id);
  ApiResponse.success(res, 200, splits);
});

const createSplit = asyncHandler(async (req, res) => {
  const split = await splitService.createSplit(req.body, req.user);
  ApiResponse.success(res, 201, split);
});

const settleShare = asyncHandler(async (req, res) => {
  const split = await splitService.settleShare(req.params.id, req.user, req.body.participantUserId);
  ApiResponse.success(res, 200, split);
});

module.exports = { getAllSplits, getMySplits, createSplit, settleShare };
