const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// These MySQL error codes are safe to skip — they mean "already done"
const SKIP_ERRNO = new Set([
    1060, // ER_DUP_FIELDNAME  – column already exists (ALTER TABLE ADD COLUMN)
    1061, // ER_DUP_KEY        – duplicate key name (CREATE INDEX)
    1050, // ER_TABLE_EXISTS   – table already exists (shouldn't happen with IF NOT EXISTS)
    1062, // ER_DUP_ENTRY      – duplicate row (seed data already inserted)
]);

async function runMigrations() {
    const dbName = process.env.DB_NAME || 'lanari_db';

    // Connect WITHOUT a database so we can create it if it doesn't exist
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    // Ensure database exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${dbName}\``);

    // Tracking table – records which migration files have been applied
    await conn.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id           INT AUTO_INCREMENT PRIMARY KEY,
            filename     VARCHAR(255) NOT NULL UNIQUE,
            applied_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Build set of already-applied migration filenames
    const [applied] = await conn.query('SELECT filename FROM schema_migrations');
    const appliedSet = new Set(applied.map(r => r.filename));

    // Read all .sql files from the migrations directory, sorted numerically
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    let ran = 0;

    for (const file of files) {
        if (appliedSet.has(file)) continue;

        console.log(`[migrate] Running: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

        // Split file into individual statements (strip comments & blank lines)
        const statements = sql
            .split(';')
            .map(s => s.replace(/--[^\n]*/g, '').trim())
            .filter(s => s.length > 0);

        for (const stmt of statements) {
            try {
                await conn.query(stmt);
            } catch (err) {
                if (SKIP_ERRNO.has(err.errno)) {
                    console.warn(`[migrate]   skipped (already exists): ${err.sqlMessage}`);
                } else {
                    console.error(`[migrate]   FAILED in ${file}:\n  ${err.sqlMessage}`);
                    await conn.end();
                    throw err;
                }
            }
        }

        await conn.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
        console.log(`[migrate]   ✓ ${file}`);
        ran++;
    }

    await conn.end();

    if (ran === 0) {
        console.log('[migrate] All migrations already applied.');
    } else {
        console.log(`[migrate] Done — ${ran} migration(s) applied.`);
    }
}

module.exports = runMigrations;
