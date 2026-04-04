const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  deleteUser,
  createUser
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const { validate, userSchema } = require('../middleware/validation');

// All routes are protected and only for Admin
router.use(protect);
router.use(authorize('Admin'));

router.get('/', getUsers);
router.post('/', validate(userSchema), createUser);
router.put('/:id', validate(userSchema), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
