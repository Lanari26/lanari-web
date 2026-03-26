const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/auth');
const { getWorkspace, createReport, updateTaskStatus } = require('../controllers/team.controller');

router.use(protect);

router.get('/workspace', staffOnly, getWorkspace);
router.post('/reports', staffOnly, createReport);
router.patch('/tasks/:id/status', staffOnly, updateTaskStatus);

module.exports = router;
