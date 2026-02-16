const Contact = require('../models/contact.model');

exports.create = async (req, res, next) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        const id = await Contact.create({ firstName, lastName, email, message });
        res.status(201).json({ success: true, message: 'Message received', id });
    } catch (err) {
        next(err);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const messages = await Contact.findAll();
        res.json({ success: true, data: messages });
    } catch (err) {
        next(err);
    }
};

exports.markRead = async (req, res, next) => {
    try {
        const updated = await Contact.markRead(req.params.id);
        if (!updated) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ success: true, message: 'Marked as read' });
    } catch (err) {
        next(err);
    }
};
