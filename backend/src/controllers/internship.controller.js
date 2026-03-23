const { Internship, InternshipApplication } = require('../models/internship.model');
const Activity = require('../models/activity.model');
const { sendMail, templates } = require('../config/email');

exports.getInternships = async (req, res, next) => {
    try {
        const internships = await Internship.findAllActive();
        res.json({ success: true, data: internships });
    } catch (err) {
        next(err);
    }
};

exports.getInternship = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ error: 'Internship not found' });
        }
        res.json({ success: true, data: internship });
    } catch (err) {
        next(err);
    }
};

exports.createInternship = async (req, res, next) => {
    try {
        const { title, department, duration, location, description, requirements } = req.body;
        const id = await Internship.create({ title, department, duration, location, description, requirements });
        res.status(201).json({ success: true, message: 'Internship created', id });
    } catch (err) {
        next(err);
    }
};

exports.updateInternship = async (req, res, next) => {
    try {
        const updated = await Internship.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Internship not found or no changes made' });
        }
        res.json({ success: true, message: 'Internship updated' });
    } catch (err) {
        next(err);
    }
};

exports.deleteInternship = async (req, res, next) => {
    try {
        const deactivated = await Internship.deactivate(req.params.id);
        if (!deactivated) {
            return res.status(404).json({ error: 'Internship not found' });
        }
        res.json({ success: true, message: 'Internship deactivated' });
    } catch (err) {
        next(err);
    }
};

exports.apply = async (req, res, next) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship || !internship.is_active) {
            return res.status(404).json({ error: 'Internship not found or no longer active' });
        }

        const { fullName, email, phone, university, fieldOfStudy, yearOfStudy, motivation, portfolioUrl } = req.body;
        const id = await InternshipApplication.create({
            internshipId: req.params.id,
            fullName,
            email,
            phone,
            university,
            fieldOfStudy,
            yearOfStudy,
            motivation,
            portfolioUrl
        });

        // Confirmation email to applicant
        const confirmation = templates.internshipConfirmation({
            fullName,
            internshipTitle: internship.title,
            department: internship.department
        });
        sendMail({ to: email, ...confirmation });

        // Notify admin
        const adminNotif = templates.internshipNotifyAdmin({
            fullName,
            email,
            university,
            fieldOfStudy,
            internshipTitle: internship.title,
            department: internship.department,
            motivation
        });
        sendMail({ to: process.env.SMTP_USER, ...adminNotif });

        Activity.log('internship_apply', null, { email, internshipTitle: internship.title });

        res.status(201).json({ success: true, message: 'Application submitted', id });
    } catch (err) {
        next(err);
    }
};

exports.getApplications = async (req, res, next) => {
    try {
        const applications = await InternshipApplication.findAll();
        res.json({ success: true, data: applications });
    } catch (err) {
        next(err);
    }
};

exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const valid = ['received', 'reviewing', 'interview', 'accepted', 'rejected'];
        if (!valid.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
        }
        const updated = await InternshipApplication.updateStatus(req.params.id, status);
        if (!updated) return res.status(404).json({ error: 'Application not found' });
        res.json({ success: true, message: 'Application status updated' });
    } catch (err) {
        next(err);
    }
};

exports.getAllInternships = async (req, res, next) => {
    try {
        const internships = await Internship.findAll();
        res.json({ success: true, data: internships });
    } catch (err) {
        next(err);
    }
};
