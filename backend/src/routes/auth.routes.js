const express = require('express');
const router = express.Router();
const { register, login, getMe, getDashboard, mailLogin } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { validateRequired, validateRegistration } = require('../middleware/validate');

router.post('/register', validateRegistration, register);
router.post('/login', validateRequired(['email', 'password']), login);
router.get('/me', protect, getMe);
router.get('/dashboard', protect, getDashboard);
router.post('/mail-login', validateRequired(['email', 'password']), mailLogin);

module.exports = router;
