const { Job, Application } = require('../models/job.model');
const Activity = require('../models/activity.model');
const { sendMail, templates } = require('../config/email');

exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.findAllActive();
        res.json({ success: true, data: jobs });
    } catch (err) {
        next(err);
    }
};

exports.getJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};

exports.createJob = async (req, res, next) => {
    try {
        const { title, department, type, location, description } = req.body;
        const id = await Job.create({ title, department, type, location, description });
        res.status(201).json({ success: true, message: 'Job listing created', id });
    } catch (err) {
        next(err);
    }
};

exports.updateJob = async (req, res, next) => {
    try {
        const updated = await Job.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Job not found or no changes made' });
        }
        res.json({ success: true, message: 'Job listing updated' });
    } catch (err) {
        next(err);
    }
};

exports.deleteJob = async (req, res, next) => {
    try {
        const deactivated = await Job.deactivate(req.params.id);
        if (!deactivated) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ success: true, message: 'Job listing deactivated' });
    } catch (err) {
        next(err);
    }
};

exports.apply = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job || !job.is_active) {
            return res.status(404).json({ error: 'Job not found or no longer active' });
        }

        const { applicantName, applicantEmail, coverLetter } = req.body;
        const id = await Application.create({
            jobId: req.params.id,
            applicantName,
            applicantEmail,
            coverLetter
        });

        // Confirmation email to applicant
        const confirmation = templates.applicationConfirmation({
            applicantName,
            jobTitle: job.title,
            department: job.department
        });
        sendMail({ to: applicantEmail, ...confirmation });

        // Notify admin
        const adminNotif = templates.applicationNotifyAdmin({
            applicantName,
            applicantEmail,
            jobTitle: job.title,
            department: job.department,
            coverLetter
        });
        sendMail({ to: process.env.SMTP_USER, ...adminNotif });

        Activity.log('job_apply', null, { applicantEmail, jobTitle: job.title });

        res.status(201).json({ success: true, message: 'Application submitted', id });
    } catch (err) {
        next(err);
    }
};

exports.getApplications = async (req, res, next) => {
    try {
        const applications = await Application.findAll();
        res.json({ success: true, data: applications });
    } catch (err) {
        next(err);
    }
};
