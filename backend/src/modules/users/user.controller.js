const asyncHandler = require('../../common/asyncHandler');
const ApiResponse = require('../../common/ApiResponse');
const userService = require('./user.service');

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  ApiResponse.success(res, 200, users);
});

const getDirectory = asyncHandler(async (req, res) => {
  const users = await userService.listDirectory();
  ApiResponse.success(res, 200, users);
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  ApiResponse.success(res, 201, user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  ApiResponse.success(res, 200, user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  ApiResponse.message(res, 200, 'User removed');
});

module.exports = { getUsers, getDirectory, createUser, updateUser, deleteUser };
