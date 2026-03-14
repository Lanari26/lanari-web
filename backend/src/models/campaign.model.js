const pool = require('../config/db');

const Campaign = {
    async create({ title, subject, templateKey, htmlContent, audience, createdBy }) {
        const [result] = await pool.query(
            `INSERT INTO campaigns (title, subject, template_key, html_content, audience, created_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, subject, templateKey || null, htmlContent, audience || 'all', createdBy]
        );
        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query(
            `SELECT c.*, u.full_name AS created_by_name
             FROM campaigns c
             LEFT JOIN users u ON c.created_by = u.id
             ORDER BY c.created_at DESC`
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT c.*, u.full_name AS created_by_name
             FROM campaigns c
             LEFT JOIN users u ON c.created_by = u.id
             WHERE c.id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    async updateStatus(id, status, { sentCount, failedCount, totalRecipients } = {}) {
        const sets = ['status = ?'];
        const vals = [status];

        if (totalRecipients !== undefined) { sets.push('total_recipients = ?'); vals.push(totalRecipients); }
        if (sentCount !== undefined) { sets.push('sent_count = ?'); vals.push(sentCount); }
        if (failedCount !== undefined) { sets.push('failed_count = ?'); vals.push(failedCount); }
        if (status === 'sent' || status === 'failed') { sets.push('sent_at = NOW()'); }

        vals.push(id);
        const [result] = await pool.query(
            `UPDATE campaigns SET ${sets.join(', ')} WHERE id = ?`,
            vals
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM campaigns WHERE id = ? AND status = "draft"', [id]);
        return result.affectedRows > 0;
    },

    async getRecipientEmails(audience) {
        let where = 'WHERE is_active = TRUE';
        if (audience === 'active') where = 'WHERE is_active = TRUE';
        else if (audience === 'inactive') where = 'WHERE is_active = FALSE';
        else if (audience === 'admin') where = "WHERE role = 'admin' AND is_active = TRUE";
        else if (audience === 'employee') where = "WHERE role = 'employee' AND is_active = TRUE";
        else if (audience === 'user') where = "WHERE role = 'user' AND is_active = TRUE";
        // 'all' = all active users

        const [rows] = await pool.query(`SELECT id, full_name, email FROM users ${where}`);
        return rows;
    }
};

module.exports = Campaign;
