const pool = require('../config/db');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');

exports.getStats = async (req, res, next) => {
    try {
        const [[{ users }]] = await pool.query('SELECT COUNT(*) as users FROM users');
        const [[{ messages }]] = await pool.query('SELECT COUNT(*) as messages FROM contact_messages');
        const [[{ unreadMessages }]] = await pool.query('SELECT COUNT(*) as unreadMessages FROM contact_messages WHERE is_read = FALSE');
        const [[{ partners }]] = await pool.query('SELECT COUNT(*) as partners FROM partner_requests');
        const [[{ pendingPartners }]] = await pool.query("SELECT COUNT(*) as pendingPartners FROM partner_requests WHERE status = 'pending'");
        const [[{ jobs }]] = await pool.query('SELECT COUNT(*) as jobs FROM job_listings WHERE is_active = TRUE');
        const [[{ applications }]] = await pool.query('SELECT COUNT(*) as applications FROM job_applications');
        const [[{ newApplications }]] = await pool.query("SELECT COUNT(*) as newApplications FROM job_applications WHERE status = 'received'");

        res.json({
            success: true,
            data: { users, messages, unreadMessages, partners, pendingPartners, jobs, applications, newApplications }
        });
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const valid = ['user', 'admin', 'employee'];
        if (!valid.includes(role)) {
            return res.status(400).json({ error: `Role must be one of: ${valid.join(', ')}` });
        }
        const updated = await User.updateRole(req.params.id, role);
        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true, message: 'Role updated' });
    } catch (err) {
        next(err);
    }
};

exports.getAnalytics = async (req, res, next) => {
    try {
        const [overview, uniqueVisitors, today, week, month, dailyActivity, topPages, recent] = await Promise.all([
            Activity.getOverview(),
            Activity.getUniqueVisitors(),
            Activity.getTodayStats(),
            Activity.getWeekStats(),
            Activity.getMonthStats(),
            Activity.getDailyActivity(14),
            Activity.getTopPages(10),
            Activity.getRecent(30)
        ]);

        res.json({
            success: true,
            data: { overview, uniqueVisitors, today, week, month, dailyActivity, topPages, recent }
        });
    } catch (err) {
        next(err);
    }
};

exports.toggleUserActive = async (req, res, next) => {
    try {
        const updated = await User.toggleActive(req.params.id);
        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true, message: 'User status toggled' });
    } catch (err) {
        next(err);
    }
};
