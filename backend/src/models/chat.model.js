const pool = require('../config/db');

const ChatSession = {
    async create(userId, title) {
        const [result] = await pool.query(
            'INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)',
            [userId, title || 'New Chat']
        );
        return result.insertId;
    },

    async findByUser(userId) {
        const [rows] = await pool.query(
            'SELECT s.*, (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as message_count FROM chat_sessions s WHERE s.user_id = ? ORDER BY s.updated_at DESC',
            [userId]
        );
        return rows;
    },

    async findById(id, userId) {
        const [rows] = await pool.query(
            'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    },

    async updateTitle(id, userId, title) {
        const [result] = await pool.query(
            'UPDATE chat_sessions SET title = ? WHERE id = ? AND user_id = ?',
            [title, id, userId]
        );
        return result.affectedRows > 0;
    },

    async touch(id) {
        await pool.query('UPDATE chat_sessions SET updated_at = NOW() WHERE id = ?', [id]);
    },

    async delete(id, userId) {
        const [result] = await pool.query(
            'DELETE FROM chat_sessions WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
};

const ChatMessage = {
    async create({ sessionId, role, content, link }) {
        const [result] = await pool.query(
            'INSERT INTO chat_messages (session_id, role, content, link) VALUES (?, ?, ?, ?)',
            [sessionId, role, content, link || null]
        );
        return result.insertId;
    },

    async findBySession(sessionId) {
        const [rows] = await pool.query(
            'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC',
            [sessionId]
        );
        return rows;
    }
};

module.exports = { ChatSession, ChatMessage };
