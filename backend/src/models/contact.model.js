const pool = require('../config/db');

const Contact = {
    async create({ firstName, lastName, email, message }) {
        const [result] = await pool.query(
            'INSERT INTO contact_messages (first_name, last_name, email, message) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, message]
        );
        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        return rows;
    },

    async markRead(id) {
        const [result] = await pool.query(
            'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Contact;
