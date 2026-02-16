const pool = require('../config/db');

const Job = {
    async findAllActive() {
        const [rows] = await pool.query(
            'SELECT * FROM job_listings WHERE is_active = TRUE ORDER BY created_at DESC'
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM job_listings WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ title, department, type, location, description }) {
        const [result] = await pool.query(
            'INSERT INTO job_listings (title, department, type, location, description) VALUES (?, ?, ?, ?, ?)',
            [title, department, type, location, description || null]
        );
        return result.insertId;
    },

    async update(id, { title, department, type, location, description, isActive }) {
        const fields = [];
        const values = [];

        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (department !== undefined) { fields.push('department = ?'); values.push(department); }
        if (type !== undefined) { fields.push('type = ?'); values.push(type); }
        if (location !== undefined) { fields.push('location = ?'); values.push(location); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (isActive !== undefined) { fields.push('is_active = ?'); values.push(isActive); }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await pool.query(
            `UPDATE job_listings SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async deactivate(id) {
        const [result] = await pool.query(
            'UPDATE job_listings SET is_active = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

const Application = {
    async create({ jobId, applicantName, applicantEmail, coverLetter }) {
        const [result] = await pool.query(
            'INSERT INTO job_applications (job_id, applicant_name, applicant_email, cover_letter) VALUES (?, ?, ?, ?)',
            [jobId, applicantName, applicantEmail, coverLetter || null]
        );
        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query(
            `SELECT ja.*, jl.title AS job_title, jl.department
             FROM job_applications ja
             JOIN job_listings jl ON ja.job_id = jl.id
             ORDER BY ja.created_at DESC`
        );
        return rows;
    }
};

module.exports = { Job, Application };
