const pool = require('../config/db');

const Internship = {
    async findAllActive() {
        const [rows] = await pool.query(
            'SELECT * FROM internships WHERE is_active = TRUE ORDER BY created_at DESC'
        );
        return rows;
    },

    async findAll() {
        const [rows] = await pool.query('SELECT * FROM internships ORDER BY created_at DESC');
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM internships WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ title, department, duration, location, description, requirements }) {
        const [result] = await pool.query(
            'INSERT INTO internships (title, department, duration, location, description, requirements) VALUES (?, ?, ?, ?, ?, ?)',
            [title, department, duration, location, description || null, requirements || null]
        );
        return result.insertId;
    },

    async update(id, { title, department, duration, location, description, requirements, isActive }) {
        const fields = [];
        const values = [];

        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (department !== undefined) { fields.push('department = ?'); values.push(department); }
        if (duration !== undefined) { fields.push('duration = ?'); values.push(duration); }
        if (location !== undefined) { fields.push('location = ?'); values.push(location); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (requirements !== undefined) { fields.push('requirements = ?'); values.push(requirements); }
        if (isActive !== undefined) { fields.push('is_active = ?'); values.push(isActive); }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await pool.query(
            `UPDATE internships SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async deactivate(id) {
        const [result] = await pool.query(
            'UPDATE internships SET is_active = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

const InternshipApplication = {
    async create({ internshipId, fullName, email, phone, university, fieldOfStudy, yearOfStudy, motivation, portfolioUrl }) {
        const [result] = await pool.query(
            'INSERT INTO internship_applications (internship_id, full_name, email, phone, university, field_of_study, year_of_study, motivation, portfolio_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [internshipId, fullName, email, phone || null, university || null, fieldOfStudy || null, yearOfStudy || null, motivation || null, portfolioUrl || null]
        );
        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query(
            `SELECT ia.*, i.title AS internship_title, i.department
             FROM internship_applications ia
             JOIN internships i ON ia.internship_id = i.id
             ORDER BY ia.created_at DESC`
        );
        return rows;
    },

    async updateStatus(id, status) {
        const [result] = await pool.query(
            'UPDATE internship_applications SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    },

    async count() {
        const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM internship_applications');
        return count;
    },

    async countNew() {
        const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM internship_applications WHERE status = 'received'");
        return count;
    }
};

module.exports = { Internship, InternshipApplication };
