const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.query(
            'SELECT id, full_name, email, role FROM users WHERE id = ?',
            [decoded.id]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = rows[0];
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Not authorized, token invalid' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { protect, adminOnly };
