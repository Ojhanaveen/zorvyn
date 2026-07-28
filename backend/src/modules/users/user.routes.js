const express = require('express');
const router = express.Router();
const { getUsers, getDirectory, createUser, updateUser, deleteUser } = require('./user.controller');
const { protect, authorize } = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const { createUserSchema, updateUserSchema } = require('./user.validation');

router.use(protect);

// Minimal listing (name/email/role only) for populating pickers like split-expense participants
router.get('/directory', authorize('Analyst', 'Admin'), getDirectory);

router.use(authorize('Admin'));

router.get('/', getUsers);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
