const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/event.controller');
const { protect } = require('../middleware/auth');
const { validateRequired } = require('../middleware/validate');

router.get('/', protect, getEvents);
router.post('/', protect, validateRequired(['title', 'eventDate']), createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
