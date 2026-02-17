const Doc = require('../models/doc.model');

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// ─── Public ──────────────────────────────────────────────────

exports.getPublished = async (req, res, next) => {
    try {
        const docs = await Doc.findPublished();
        res.json({ success: true, data: docs });
    } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
    try {
        const doc = await Doc.findBySlug(req.params.slug);
        if (!doc) return res.status(404).json({ error: 'Document not found' });
        res.json({ success: true, data: doc });
    } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Doc.getCategories();
        res.json({ success: true, data: categories });
    } catch (err) { next(err); }
};

// ─── Admin ───────────────────────────────────────────────────

exports.getAll = async (req, res, next) => {
    try {
        const docs = await Doc.findAll();
        res.json({ success: true, data: docs });
    } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
    try {
        const { title, category, content, icon, sortOrder, isPublished } = req.body;
        const slug = slugify(title);

        const id = await Doc.create({ title, slug, category, content, icon, sortOrder });

        if (isPublished === false) {
            await Doc.update(id, { isPublished: false });
        }

        const doc = await Doc.findById(id);
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A document with this title already exists' });
        }
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const data = { ...req.body };
        if (data.title) {
            data.slug = slugify(data.title);
        }

        const updated = await Doc.update(req.params.id, data);
        if (!updated) return res.status(404).json({ error: 'Document not found' });

        const doc = await Doc.findById(req.params.id);
        res.json({ success: true, data: doc });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A document with this title already exists' });
        }
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const deleted = await Doc.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Document not found' });
        res.json({ success: true, message: 'Document deleted' });
    } catch (err) { next(err); }
};
