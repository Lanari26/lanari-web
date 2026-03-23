const express = require('express');
const router = express.Router();
const {
    getInternships, getInternship, createInternship, updateInternship,
    deleteInternship, apply, getApplications, updateApplicationStatus, getAllInternships
} = require('../controllers/internship.controller');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

// Public
router.get('/', getInternships);
router.get('/:id', getInternship);
router.post('/:id/apply', validateRequired(['fullName', 'email']), apply);

// Admin
router.get('/admin/all', protect, adminOnly, getAllInternships);
router.post('/', protect, adminOnly, validateRequired(['title', 'department', 'duration', 'location']), createInternship);
router.put('/:id', protect, adminOnly, updateInternship);
router.delete('/:id', protect, adminOnly, deleteInternship);
router.get('/admin/applications', protect, adminOnly, getApplications);
router.patch('/admin/applications/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
