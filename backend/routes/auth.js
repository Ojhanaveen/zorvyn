const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
