const userRepository = require('./user.repository');
const ApiError = require('../../common/ApiError');

const ALLOWED_UPDATE_FIELDS = ['role', 'status', 'name', 'email'];

const listUsers = () => userRepository.findAllSafe();

// Minimal, non-sensitive listing used to populate participant pickers (e.g. split expenses)
const listDirectory = () => userRepository.findDirectory();

const createUser = async ({ name, email, password, role, status }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw ApiError.badRequest('User already exists');
  }
  const user = await userRepository.create({ name, email, password, role, status });
  return user.toSafeJSON();
};

const updateUser = async (id, body) => {
  const updateData = {};
  ALLOWED_UPDATE_FIELDS.forEach((field) => {
    if (body[field] !== undefined) updateData[field] = body[field];
  });

  const existing = await userRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('User not found');
  }

  return userRepository.updateById(id, updateData);
};

const deleteUser = async (id) => {
  const existing = await userRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('User not found');
  }
  await userRepository.deleteById(id);
};

module.exports = { listUsers, listDirectory, createUser, updateUser, deleteUser };
