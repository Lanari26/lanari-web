const pool = require('../config/db');

// Auto-create table on module load
pool.query(`
    CREATE TABLE IF NOT EXISTS activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        user_id INT DEFAULT NULL,
        metadata JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_event_type (event_type),
        INDEX idx_created_at (created_at)
    )
`).catch(err => console.error('Failed to create activity_log table:', err.message));

const Activity = {
    async log(eventType, userId = null, metadata = null) {
        try {
            await pool.query(
                'INSERT INTO activity_log (event_type, user_id, metadata) VALUES (?, ?, ?)',
                [eventType, userId, metadata ? JSON.stringify(metadata) : null]
            );
        } catch (err) {
            console.error('Activity log error:', err.message);
        }
    },

    async getOverview() {
        const [[totals]] = await pool.query(`
            SELECT
                SUM(event_type = 'page_visit') AS totalVisits,
                SUM(event_type = 'login') AS totalLogins,
                SUM(event_type = 'register') AS totalRegistrations,
                SUM(event_type = 'contact_submit') AS totalContacts,
                SUM(event_type = 'job_apply') AS totalApplications,
                SUM(event_type = 'partner_request') AS totalPartnerRequests
            FROM activity_log
        `);
        return totals;
    },

    async getUniqueVisitors() {
        const [[{ count }]] = await pool.query(`
            SELECT COUNT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.ip'))) AS count
            FROM activity_log WHERE event_type = 'page_visit'
        `);
        return count;
    },

    async getTodayStats() {
        const [[stats]] = await pool.query(`
            SELECT
                SUM(event_type = 'page_visit') AS visits,
                SUM(event_type = 'login') AS logins,
                SUM(event_type = 'register') AS registrations,
                SUM(event_type = 'contact_submit') AS contacts,
                SUM(event_type = 'job_apply') AS applications,
                SUM(event_type = 'partner_request') AS partnerRequests
            FROM activity_log
            WHERE DATE(created_at) = CURDATE()
        `);
        return stats;
    },

    async getWeekStats() {
        const [[stats]] = await pool.query(`
            SELECT
                SUM(event_type = 'page_visit') AS visits,
                SUM(event_type = 'login') AS logins,
                SUM(event_type = 'register') AS registrations
            FROM activity_log
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        `);
        return stats;
    },

    async getMonthStats() {
        const [[stats]] = await pool.query(`
            SELECT
                SUM(event_type = 'page_visit') AS visits,
                SUM(event_type = 'login') AS logins,
                SUM(event_type = 'register') AS registrations
            FROM activity_log
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        `);
        return stats;
    },

    async getDailyActivity(days = 14) {
        const [rows] = await pool.query(`
            SELECT
                DATE(created_at) AS date,
                SUM(event_type = 'page_visit') AS visits,
                SUM(event_type = 'login') AS logins,
                SUM(event_type = 'register') AS registrations
            FROM activity_log
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `, [days]);
        return rows;
    },

    async getTopPages(limit = 10) {
        const [rows] = await pool.query(`
            SELECT
                JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.page')) AS page,
                COUNT(*) AS visits
            FROM activity_log
            WHERE event_type = 'page_visit'
            GROUP BY page
            ORDER BY visits DESC
            LIMIT ?
        `, [limit]);
        return rows;
    },

    async getRecent(limit = 20) {
        const [rows] = await pool.query(`
            SELECT al.*, u.full_name
            FROM activity_log al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }
};

module.exports = Activity;
