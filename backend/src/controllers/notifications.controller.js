const Notification = require('../models/notification.model');

exports.getAll = async (req, res, next) => {
    try {
        const notifications = await Notification.findByUser(req.user.id);
        res.json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

exports.markRead = async (req, res, next) => {
    try {
        const updated = await Notification.markRead(req.params.id, req.user.id);
        if (!updated) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ success: true, message: 'Marked as read' });
    } catch (err) {
        next(err);
    }
};

exports.markAllRead = async (req, res, next) => {
    try {
        const count = await Notification.markAllRead(req.user.id);
        res.json({ success: true, message: `${count} notifications marked as read` });
    } catch (err) {
        next(err);
    }
};
