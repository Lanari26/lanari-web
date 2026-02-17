const fs = require('fs');
const path = require('path');
const { ChatSession, ChatMessage } = require('../models/chat.model');

let knowledgeBase = [];

function loadKnowledge() {
    const csvPath = path.join(__dirname, '../../data/ai_knowledge.csv');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1);

    knowledgeBase = [];
    for (const line of lines) {
        if (!line.trim()) continue;
        const match = line.match(/^"([^"]+)","((?:[^"]|"")+)","?([^"]*)"?$/);
        if (!match) continue;
        const keys = match[1].split(',').map(k => k.trim());
        const answer = match[2].replace(/""/g, '"');
        const link = match[3] || null;
        knowledgeBase.push({ keys, answer, link });
    }
}

loadKnowledge();

function getResponse(message) {
    const q = message.toLowerCase().trim();

    if (['hi', 'hello', 'hey', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'].some(g => q.includes(g))) {
        return {
            text: "Hello! 👋 I'm **Lanari AI**, your intelligent assistant.\n\nI can help you explore everything Lanari Tech offers — from our e-commerce platform **Siri**, to **Rise** for jobs and freelancing, our **Coding Academy**, and much more.\n\nWhat would you like to know?",
            link: null
        };
    }

    if (['thank', 'thanks', 'thx', 'appreciate'].some(g => q.includes(g))) {
        return {
            text: "You're welcome! 😊 Let me know if there's anything else I can help with.\n\nFeel free to ask about any of our products, services, or opportunities!",
            link: null
        };
    }

    let bestMatch = null;
    let bestScore = 0;
    for (const entry of knowledgeBase) {
        let score = 0;
        for (const key of entry.keys) {
            if (q.includes(key)) score += key.length;
        }
        if (score > bestScore) { bestScore = score; bestMatch = entry; }
    }

    if (bestMatch && bestScore >= 2) {
        return { text: bestMatch.answer, link: bestMatch.link };
    }

    return {
        text: "I appreciate your question! While I may not have specific details on that topic, here's what I can help you with:\n\n- 🛍️ **Siri Market** — E-commerce & reselling\n- 🚀 **Rise Network** — Jobs, freelancing & networking\n- 🎓 **Coding Academy** — Learn digital skills\n- 🤖 **AI Solutions** — Smart business tools\n- ☁️ **Cloud Services** — Hosting & infrastructure\n- 💼 **Careers** — Join our team\n- 🤝 **Partnerships** — Collaborate with us\n\nTry asking about any of these topics!",
        link: null
    };
}

exports.getKnowledge = async (req, res) => {
    loadKnowledge();
    res.json({ success: true, data: knowledgeBase });
};

// Chat with session persistence
exports.chat = async (req, res, next) => {
    try {
        const { message, sessionId } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        loadKnowledge();
        const userId = req.user.id;
        let sid = sessionId;

        // Create new session if none provided
        if (!sid) {
            const title = message.trim().substring(0, 60);
            sid = await ChatSession.create(userId, title);
        } else {
            // Verify session belongs to user
            const session = await ChatSession.findById(sid, userId);
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
        }

        // Save user message
        await ChatMessage.create({ sessionId: sid, role: 'user', content: message.trim() });

        // Generate response
        const response = getResponse(message);

        // Save AI response
        await ChatMessage.create({ sessionId: sid, role: 'ai', content: response.text, link: response.link });

        // Touch session to update timestamp
        await ChatSession.touch(sid);

        res.json({
            success: true,
            sessionId: sid,
            data: response
        });
    } catch (err) {
        next(err);
    }
};

// Get all sessions for current user
exports.getSessions = async (req, res, next) => {
    try {
        const sessions = await ChatSession.findByUser(req.user.id);
        res.json({ success: true, data: sessions });
    } catch (err) {
        next(err);
    }
};

// Get messages for a session
exports.getSession = async (req, res, next) => {
    try {
        const session = await ChatSession.findById(req.params.id, req.user.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        const messages = await ChatMessage.findBySession(session.id);
        res.json({ success: true, data: { session, messages } });
    } catch (err) {
        next(err);
    }
};

// Delete a session
exports.deleteSession = async (req, res, next) => {
    try {
        const deleted = await ChatSession.delete(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json({ success: true, message: 'Session deleted' });
    } catch (err) {
        next(err);
    }
};
