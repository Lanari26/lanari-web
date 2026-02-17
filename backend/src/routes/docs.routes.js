const express = require('express');
const router = express.Router();
const { getPublished, getBySlug, getCategories, getAll, create, update, remove } = require('../controllers/docs.controller');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

// Public
router.get('/categories', getCategories);
router.get('/admin/all', protect, adminOnly, getAll);
router.get('/:slug', getBySlug);
router.get('/', getPublished);

// Admin
router.post('/', protect, adminOnly, validateRequired(['title', 'category', 'content']), create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
