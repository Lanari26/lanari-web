const Campaign = require('../models/campaign.model');
const { sendMail, campaignTemplates } = require('../config/email');

exports.getTemplates = async (req, res) => {
    const templates = Object.entries(campaignTemplates).map(([key, t]) => ({
        key,
        name: t.name,
        description: t.description,
        subject: t.subject,
        html: t.html
    }));
    res.json({ success: true, data: templates });
};

exports.getCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.findAll();
        res.json({ success: true, data: campaigns });
    } catch (err) {
        next(err);
    }
};

exports.getCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json({ success: true, data: campaign });
    } catch (err) {
        next(err);
    }
};

exports.createCampaign = async (req, res, next) => {
    try {
        const { title, subject, templateKey, htmlContent, audience } = req.body;
        if (!title || !subject || !htmlContent) {
            return res.status(400).json({ error: 'Title, subject, and HTML content are required' });
        }
        const id = await Campaign.create({
            title,
            subject,
            templateKey,
            htmlContent,
            audience,
            createdBy: req.user.id
        });
        const campaign = await Campaign.findById(id);
        res.status(201).json({ success: true, data: campaign });
    } catch (err) {
        next(err);
    }
};

exports.sendCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        if (campaign.status === 'sent') return res.status(400).json({ error: 'Campaign already sent' });
        if (campaign.status === 'sending') return res.status(400).json({ error: 'Campaign is currently sending' });

        const recipients = await Campaign.getRecipientEmails(campaign.audience);
        if (recipients.length === 0) {
            return res.status(400).json({ error: 'No recipients found for this audience' });
        }

        await Campaign.updateStatus(campaign.id, 'sending', { totalRecipients: recipients.length });

        // Send response immediately, process emails in background
        res.json({
            success: true,
            message: `Sending campaign to ${recipients.length} recipients...`,
            data: { totalRecipients: recipients.length }
        });

        // Process emails in background
        let sentCount = 0;
        let failedCount = 0;

        for (const recipient of recipients) {
            try {
                // Replace {{name}} placeholder with recipient name
                const personalizedHtml = campaign.html_content
                    .replace(/\{\{name\}\}/gi, recipient.full_name)
                    .replace(/\{\{email\}\}/gi, recipient.email);

                await sendMail({
                    to: recipient.email,
                    subject: campaign.subject,
                    html: personalizedHtml
                });
                sentCount++;
            } catch {
                failedCount++;
            }
        }

        const finalStatus = failedCount === recipients.length ? 'failed' : 'sent';
        await Campaign.updateStatus(campaign.id, finalStatus, { sentCount, failedCount });
    } catch (err) {
        next(err);
    }
};

exports.deleteCampaign = async (req, res, next) => {
    try {
        const deleted = await Campaign.delete(req.params.id);
        if (!deleted) return res.status(400).json({ error: 'Campaign not found or already sent' });
        res.json({ success: true, message: 'Campaign deleted' });
    } catch (err) {
        next(err);
    }
};
