const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, apply, getApplications } = require('../controllers/careers.controller');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

// Public
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJob);
router.post('/jobs/:id/apply', validateRequired(['applicantName', 'applicantEmail']), apply);

// Admin
router.post('/jobs', protect, adminOnly, validateRequired(['title', 'department', 'type', 'location']), createJob);
router.put('/jobs/:id', protect, adminOnly, updateJob);
router.delete('/jobs/:id', protect, adminOnly, deleteJob);
router.get('/applications', protect, adminOnly, getApplications);

module.exports = router;
