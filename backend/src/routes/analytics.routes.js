const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Activity = require('../models/activity.model');

// Public endpoint — track page visits (no auth required)
router.post('/track', async (req, res) => {
    try {
        const { event, page } = req.body;
        if (!event || !page) {
            return res.status(400).json({ error: 'event and page are required' });
        }

        // Try to extract user_id from token if present
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (_) { /* anonymous visitor */ }
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await Activity.log(event, userId, { page, ip, userAgent });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Tracking failed' });
    }
});

module.exports = router;
