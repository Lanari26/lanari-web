const Investor = require('../models/investor.model');
const { sendMail, templates } = require('../config/email');

exports.create = async (req, res, next) => {
    try {
        const { fullName, email, phone, organization, investmentRange, message } = req.body;
        const id = await Investor.create({ fullName, email, phone, organization, investmentRange, message });

        // Confirmation email to investor
        const confirmation = templates.investorConfirmation(fullName);
        sendMail({ to: email, ...confirmation });

        // Notify admin
        const adminNotif = templates.investorNotifyAdmin({ fullName, email, phone, organization, investmentRange, message });
        sendMail({ to: process.env.SMTP_USER, ...adminNotif });

        res.status(201).json({ success: true, message: 'Investment inquiry received', id });
    } catch (err) {
        next(err);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const requests = await Investor.findAll();
        res.json({ success: true, data: requests });
    } catch (err) {
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const valid = ['pending', 'contacted', 'in_discussion', 'closed'];
        if (!valid.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
        }
        const updated = await Investor.updateStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Investor request not found' });
        }
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        next(err);
    }
};
