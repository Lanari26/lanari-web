const pool = require('../config/db');

const User = {
    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    },

    async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, full_name, email, phone_number, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },

    async create({ fullName, email, phoneNumber, passwordHash }) {
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, phone_number, password_hash) VALUES (?, ?, ?, ?)',
            [fullName, email, phoneNumber || null, passwordHash]
        );
        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query(
            'SELECT id, full_name, email, phone_number, role, is_active, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    },

    async updateRole(id, role) {
        const [result] = await pool.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id]
        );
        return result.affectedRows > 0;
    },

    async toggleActive(id) {
        const [result] = await pool.query(
            'UPDATE users SET is_active = NOT is_active WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = User;
