const express = require('express');
const router = express.Router();
const { create, getAll, updateStatus } = require('../controllers/investor.controller');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

router.post('/', validateRequired(['fullName', 'email']), create);
router.get('/', protect, adminOnly, getAll);
router.patch('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;
