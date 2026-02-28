const express = require('express');
const cors = require('cors');
require('dotenv').config();

const runMigrations = require('./config/migrate');

async function start() {
    // Run database migrations before anything else.
    // This creates the DB if it doesn't exist, applies any new migration files,
    // and gracefully skips statements whose effects are already in place
    // (e.g. ALTER TABLE ADD COLUMN when the column already exists).
    await runMigrations();

    // Pool is initialised after migrations so the database is guaranteed to exist
    require('./config/db');

    const errorHandler = require('./middleware/errorHandler');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', require('./routes/auth.routes'));
    app.use('/api/contact', require('./routes/contact.routes'));
    app.use('/api/partners', require('./routes/partner.routes'));
    app.use('/api/careers', require('./routes/careers.routes'));
    app.use('/api/notifications', require('./routes/notifications.routes'));
    app.use('/api/admin', require('./routes/admin.routes'));
    app.use('/api/events', require('./routes/event.routes'));
    app.use('/api/investors', require('./routes/investor.routes'));
    app.use('/api/search', require('./routes/search.routes'));
    app.use('/api/ai', require('./routes/ai.routes'));
    app.use('/api/analytics', require('./routes/analytics.routes'));
    app.use('/api/docs', require('./routes/docs.routes'));

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Error handler
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Lanari API running on http://localhost:${PORT}`);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});



