const pool = require('../config/db');

const Event = {
    async findByUser(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM calendar_events WHERE user_id = ? ORDER BY event_date ASC, start_time ASC',
            [userId]
        );
        return rows;
    },

    async findByUserAndMonth(userId, year, month) {
        const [rows] = await pool.query(
            'SELECT * FROM calendar_events WHERE user_id = ? AND YEAR(event_date) = ? AND MONTH(event_date) = ? ORDER BY event_date ASC, start_time ASC',
            [userId, year, month]
        );
        return rows;
    },

    async findById(id, userId) {
        const [rows] = await pool.query(
            'SELECT * FROM calendar_events WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    },

    async create({ userId, title, description, eventDate, startTime, endTime, color }) {
        const [result] = await pool.query(
            'INSERT INTO calendar_events (user_id, title, description, event_date, start_time, end_time, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description || null, eventDate, startTime || null, endTime || null, color || 'blue']
        );
        return result.insertId;
    },

    async update(id, userId, data) {
        const fields = [];
        const values = [];
        for (const [key, val] of Object.entries(data)) {
            const col = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            fields.push(`${col} = ?`);
            values.push(val);
        }
        if (fields.length === 0) return false;
        values.push(id, userId);
        const [result] = await pool.query(
            `UPDATE calendar_events SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async delete(id, userId) {
        const [result] = await pool.query(
            'DELETE FROM calendar_events WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Event;
