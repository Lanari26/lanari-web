const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { sendMail, templates } = require('../config/email');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.register = async (req, res, next) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;

        const existing = await User.findByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await User.create({ fullName, email, phoneNumber, passwordHash });
        const token = generateToken(userId);

        // Welcome notification
        await Notification.create({
            userId,
            title: 'Welcome to Lanari Tech',
            description: `Hi ${fullName}, welcome to the Lanari Tech ecosystem! Explore our products and services.`,
            type: 'success'
        });

        // Welcome email
        const welcomeEmail = templates.welcome(fullName);
        sendMail({ to: email, ...welcomeEmail });

        // Notify admin of new registration
        sendMail({
            to: process.env.SMTP_USER,
            subject: `New User Registration: ${fullName}`,
            html: `<p>New user registered: <strong>${fullName}</strong> (${email})</p>`
        });

        res.status(201).json({
            success: true,
            token,
            user: { id: userId, fullName, email, phoneNumber }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user.id);

        // Login alert email
        const loginEmail = templates.loginAlert(user.full_name);
        sendMail({ to: user.email, ...loginEmail });

        res.json({
            success: true,
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};

exports.getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        const [notifRows] = await require('../config/db').query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
            [userId]
        );

        const [unreadCount] = await require('../config/db').query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );

        const [appRows] = await require('../config/db').query(
            `SELECT ja.id, ja.created_at, ja.cover_letter,
                    jl.title AS job_title, jl.department, jl.type, jl.location
             FROM job_applications ja
             JOIN job_listings jl ON ja.job_id = jl.id
             WHERE ja.applicant_email = ?
             ORDER BY ja.created_at DESC`,
            [user.email]
        ).catch(() => [[]]);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    fullName: user.full_name,
                    email: user.email,
                    phoneNumber: user.phone_number,
                    role: user.role,
                    memberSince: user.created_at
                },
                notifications: notifRows,
                unreadNotifications: unreadCount[0].count,
                applications: appRows
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.mailLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user || !['employee', 'admin'].includes(user.role)) {
            return res.status(401).json({ error: 'Access restricted to authorized personnel' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        res.json({
            success: true,
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email }
        });
    } catch (err) {
        next(err);
    }
};
