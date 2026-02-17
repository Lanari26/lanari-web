const pool = require('../config/db');

const Investor = {
    async create({ fullName, email, phone, organization, investmentRange, message }) {
        const [result] = await pool.query(
            'INSERT INTO investor_requests (full_name, email, phone, organization, investment_range, message) VALUES (?, ?, ?, ?, ?, ?)',
            [fullName, email, phone || null, organization || null, investmentRange || null, message || null]
        );
        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query('SELECT * FROM investor_requests ORDER BY created_at DESC');
        return rows;
    },

    async updateStatus(id, status) {
        const [result] = await pool.query(
            'UPDATE investor_requests SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Investor;
