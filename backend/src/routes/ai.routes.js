const express = require('express');
const router = express.Router();
const { getKnowledge, chat, getSessions, getSession, deleteSession } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');

router.get('/knowledge', getKnowledge);
router.post('/chat', protect, chat);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:id', protect, getSession);
router.delete('/sessions/:id', protect, deleteSession);

module.exports = router;
