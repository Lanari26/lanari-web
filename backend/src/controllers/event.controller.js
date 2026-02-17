const Event = require('../models/event.model');

exports.getEvents = async (req, res, next) => {
    try {
        const { year, month } = req.query;
        let events;
        if (year && month) {
            events = await Event.findByUserAndMonth(req.user.id, year, month);
        } else {
            events = await Event.findByUser(req.user.id);
        }
        res.json({ success: true, data: events });
    } catch (err) {
        next(err);
    }
};

exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, eventDate, startTime, endTime, color } = req.body;
        const id = await Event.create({
            userId: req.user.id,
            title,
            description,
            eventDate,
            startTime,
            endTime,
            color
        });
        const event = await Event.findById(id, req.user.id);
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        const updated = await Event.update(req.params.id, req.user.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const event = await Event.findById(req.params.id, req.user.id);
        res.json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        const deleted = await Event.delete(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ success: true, message: 'Event deleted' });
    } catch (err) {
        next(err);
    }
};
