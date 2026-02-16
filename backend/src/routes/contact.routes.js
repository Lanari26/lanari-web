const express = require('express');
const router = express.Router();
const { create, getAll, markRead } = require('../controllers/contact.controller');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

router.post('/', validateRequired(['firstName', 'lastName', 'email', 'message']), create);
router.get('/', protect, adminOnly, getAll);
router.patch('/:id/read', protect, adminOnly, markRead);

module.exports = router;
