const pool = require('../config/db');

const Notification = {
    async findByUser(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    },

    async markRead(id, userId) {
        const [result] = await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    },

    async markAllRead(userId) {
        const [result] = await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        return result.affectedRows;
    },

    async create({ userId, title, description, type }) {
        const [result] = await pool.query(
            'INSERT INTO notifications (user_id, title, description, type) VALUES (?, ?, ?, ?)',
            [userId, title, description, type || 'info']
        );
        return result.insertId;
    }
};

module.exports = Notification;
