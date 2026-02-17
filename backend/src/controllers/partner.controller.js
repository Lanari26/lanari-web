const Partner = require('../models/partner.model');
const { sendMail, templates } = require('../config/email');

exports.create = async (req, res, next) => {
    try {
        const { organizationName, contactEmail, partnershipProposal } = req.body;
        const id = await Partner.create({ organizationName, contactEmail, partnershipProposal });

        // Confirmation email to the partner
        const confirmation = templates.partnerConfirmation(organizationName);
        sendMail({ to: contactEmail, ...confirmation });

        // Notify admin
        const adminNotif = templates.partnerNotifyAdmin({ organizationName, contactEmail, partnershipProposal });
        sendMail({ to: process.env.SMTP_USER, ...adminNotif });

        res.status(201).json({ success: true, message: 'Partnership request received', id });
    } catch (err) {
        next(err);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const requests = await Partner.findAll();
        res.json({ success: true, data: requests });
    } catch (err) {
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const valid = ['pending', 'reviewed', 'accepted', 'rejected'];
        if (!valid.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
        }

        const updated = await Partner.updateStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Partner request not found' });
        }
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        next(err);
    }
};
