const asyncHandler = require('../../common/asyncHandler');
const ApiResponse = require('../../common/ApiResponse');
const authService = require('./auth.service');

const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  ApiResponse.success(res, 200, data);
});

const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  ApiResponse.success(res, 201, data);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const data = await authService.getProfile(req.user._id);
  ApiResponse.success(res, 200, data);
});

module.exports = { loginUser, registerUser, getUserProfile };
