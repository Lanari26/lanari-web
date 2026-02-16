const express = require('express');
const router = express.Router();
const { getAll, markRead, markAllRead } = require('../controllers/notifications.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAll);
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, markRead);

module.exports = router;
