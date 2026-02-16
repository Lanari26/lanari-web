const pool = require('../config/db');

const Partner = {
    async create({ organizationName, contactEmail, partnershipProposal }) {
        const [result] = await pool.query(
            'INSERT INTO partner_requests (organization_name, contact_email, partnership_proposal) VALUES (?, ?, ?)',
            [organizationName, contactEmail, partnershipProposal]
        );
        return result.insertId;
    },

    async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM partner_requests ORDER BY created_at DESC'
        );
        return rows;
    },

    async updateStatus(id, status) {
        const [result] = await pool.query(
            'UPDATE partner_requests SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Partner;
