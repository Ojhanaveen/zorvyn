const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile } = require('./auth.controller');
const { protect } = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const { registerSchema, loginSchema } = require('./auth.validation');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
