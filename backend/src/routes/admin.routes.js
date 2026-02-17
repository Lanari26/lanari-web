const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUserRole, toggleUserActive, getAnalytics } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/toggle', toggleUserActive);

module.exports = router;
