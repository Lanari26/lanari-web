const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const Team = require('../models/team.model');
const Notification = require('../models/notification.model');
const { validateEmail } = require('../middleware/validate');

const STAFF_ROLES = new Set(['employee', 'admin']);
const TASK_STATUSES = new Set(['todo', 'in_progress', 'blocked', 'completed']);
const TASK_PRIORITIES = new Set(['low', 'medium', 'high', 'urgent']);
const MONEY_REQUEST_STATUSES = new Set(['pending', 'approved', 'rejected', 'paid']);

function badRequest(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function sanitizeResponsibilities(input) {
    if (!Array.isArray(input)) return [];
    return input
        .map((item) => String(item || '').trim())
        .filter(Boolean);
}

async function getAdminIds() {
    const [rows] = await pool.query(
        'SELECT id FROM users WHERE role = ? AND is_active = TRUE',
        ['admin']
    );
    return rows.map((row) => row.id);
}

async function notifyAdmins(title, description) {
    const adminIds = await getAdminIds();
    await Promise.all(
        adminIds.map((userId) => Notification.create({ userId, title, description, type: 'info' }))
    );
}

async function upsertTeamProfile(conn, userId, profile = {}) {
    const normalizedRoleId = profile.teamRoleId ? Number(profile.teamRoleId) : null;

    if (normalizedRoleId) {
        const [roles] = await conn.query('SELECT id FROM team_roles WHERE id = ?', [normalizedRoleId]);
        if (roles.length === 0) {
            throw badRequest('Selected team role does not exist');
        }
    }

    const [existing] = await conn.query('SELECT id FROM team_profiles WHERE user_id = ?', [userId]);
    const values = [
        normalizedRoleId,
        profile.displayTitle ? String(profile.displayTitle).trim() : null,
        profile.staffCode ? String(profile.staffCode).trim() : null,
        profile.bio ? String(profile.bio).trim() : null,
        profile.ownershipSummary ? String(profile.ownershipSummary).trim() : null
    ];

    if (existing.length > 0) {
        await conn.query(
            `UPDATE team_profiles
             SET team_role_id = ?, display_title = ?, staff_code = ?, bio = ?, ownership_summary = ?
             WHERE user_id = ?`,
            [...values, userId]
        );
        return existing[0].id;
    }

    const [result] = await conn.query(
        `INSERT INTO team_profiles (user_id, team_role_id, display_title, staff_code, bio, ownership_summary)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, ...values]
    );
    return result.insertId;
}

async function replaceResponsibilities(conn, teamRoleId, responsibilities) {
    await conn.query('DELETE FROM team_role_responsibilities WHERE team_role_id = ?', [teamRoleId]);

    for (let index = 0; index < responsibilities.length; index += 1) {
        await conn.query(
            `INSERT INTO team_role_responsibilities (team_role_id, responsibility, sort_order)
             VALUES (?, ?, ?)`,
            [teamRoleId, responsibilities[index], index + 1]
        );
    }
}

exports.getAdminTeamOverview = async (req, res, next) => {
    try {
        const [summary, members, roles, decisionRules, tasks, reports, moneyRequests] = await Promise.all([
            Team.getSummary(),
            Team.getMembers(),
            Team.getRoles(),
            Team.getDecisionRules(),
            Team.getTasks({ includeAll: true }),
            Team.getReports({ includeAll: true }),
            Team.getMoneyRequests({ includeAll: true })
        ]);

        res.json({
            success: true,
            data: { summary, members, roles, decisionRules, tasks, reports, moneyRequests }
        });
    } catch (err) {
        next(err);
    }
};

exports.getWorkspace = async (req, res, next) => {
    try {
        if (!STAFF_ROLES.has(req.user.role)) {
            throw badRequest('Team workspace is only available to staff accounts', 403);
        }

        const workspace = await Team.getWorkspace(req.user.id);
        res.json({ success: true, data: workspace });
    } catch (err) {
        next(err);
    }
};

exports.createTeamMember = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        const {
            fullName,
            email,
            phoneNumber,
            password,
            role = 'employee',
            teamRoleId = null,
            displayTitle = '',
            staffCode = '',
            bio = '',
            ownershipSummary = ''
        } = req.body;

        if (!fullName || String(fullName).trim().length < 2) {
            throw badRequest('Full name must be at least 2 characters');
        }
        if (!validateEmail(email)) {
            throw badRequest('A valid email address is required');
        }
        if (!password || String(password).length < 8) {
            throw badRequest('Password must be at least 8 characters');
        }
        if (!STAFF_ROLES.has(role)) {
            throw badRequest('Team members must use employee or admin access');
        }

        const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            throw badRequest('Email already registered', 409);
        }

        const passwordHash = await bcrypt.hash(String(password), 10);

        await conn.beginTransaction();

        const [userResult] = await conn.query(
            `INSERT INTO users (full_name, email, phone_number, password_hash, role)
             VALUES (?, ?, ?, ?, ?)`,
            [String(fullName).trim(), String(email).trim().toLowerCase(), phoneNumber || null, passwordHash, role]
        );

        await upsertTeamProfile(conn, userResult.insertId, {
            teamRoleId,
            displayTitle,
            staffCode,
            bio,
            ownershipSummary
        });

        await conn.commit();

        await Notification.create({
            userId: userResult.insertId,
            title: 'You have been added to the Lanari team',
            description: 'Your staff account is ready. Sign in to view your ownership map, tasks, and reports workspace.',
            type: 'success'
        });

        res.status(201).json({ success: true, message: 'Team member created' });
    } catch (err) {
        await conn.rollback().catch(() => {});
        next(err);
    } finally {
        conn.release();
    }
};

exports.updateTeamMember = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        const {
            fullName,
            email,
            phoneNumber,
            role,
            isActive,
            teamRoleId = null,
            displayTitle = '',
            staffCode = '',
            bio = '',
            ownershipSummary = ''
        } = req.body;

        if (!fullName || String(fullName).trim().length < 2) {
            throw badRequest('Full name must be at least 2 characters');
        }
        if (!validateEmail(email)) {
            throw badRequest('A valid email address is required');
        }
        if (!STAFF_ROLES.has(role)) {
            throw badRequest('Team members must use employee or admin access');
        }

        const memberId = Number(req.params.id);
        const [currentRows] = await conn.query('SELECT id, email FROM users WHERE id = ?', [memberId]);
        if (currentRows.length === 0) {
            throw badRequest('Team member not found', 404);
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        if (normalizedEmail !== currentRows[0].email) {
            const [emailRows] = await conn.query('SELECT id FROM users WHERE email = ? AND id <> ?', [normalizedEmail, memberId]);
            if (emailRows.length > 0) {
                throw badRequest('Email already registered', 409);
            }
        }

        await conn.beginTransaction();

        await conn.query(
            `UPDATE users
             SET full_name = ?, email = ?, phone_number = ?, role = ?, is_active = ?
             WHERE id = ?`,
            [
                String(fullName).trim(),
                normalizedEmail,
                phoneNumber || null,
                role,
                typeof isActive === 'boolean' ? isActive : true,
                memberId
            ]
        );

        await upsertTeamProfile(conn, memberId, {
            teamRoleId,
            displayTitle,
            staffCode,
            bio,
            ownershipSummary
        });

        await conn.commit();
        res.json({ success: true, message: 'Team member updated' });
    } catch (err) {
        await conn.rollback().catch(() => {});
        next(err);
    } finally {
        conn.release();
    }
};

exports.createTeamRole = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        const {
            code,
            shortLabel,
            name,
            defaultTitle = '',
            ownershipSummary = '',
            sortOrder = 0,
            responsibilities = []
        } = req.body;

        const normalizedCode = String(code || '').trim().toUpperCase();
        const normalizedName = String(name || '').trim();
        const normalizedResponsibilities = sanitizeResponsibilities(responsibilities);

        if (!normalizedCode) throw badRequest('Role code is required');
        if (!normalizedName) throw badRequest('Role name is required');

        await conn.beginTransaction();

        const [result] = await conn.query(
            `INSERT INTO team_roles (code, short_label, name, default_title, ownership_summary, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                normalizedCode,
                String(shortLabel || normalizedCode).trim(),
                normalizedName,
                String(defaultTitle || '').trim() || null,
                String(ownershipSummary || '').trim() || null,
                Number(sortOrder) || 0
            ]
        );

        await replaceResponsibilities(conn, result.insertId, normalizedResponsibilities);
        await conn.commit();

        res.status(201).json({ success: true, message: 'Team role created' });
    } catch (err) {
        await conn.rollback().catch(() => {});
        next(err);
    } finally {
        conn.release();
    }
};

exports.updateTeamRole = async (req, res, next) => {
    const conn = await pool.getConnection();
    try {
        const {
            code,
            shortLabel,
            name,
            defaultTitle = '',
            ownershipSummary = '',
            sortOrder = 0,
            responsibilities = []
        } = req.body;

        const teamRoleId = Number(req.params.id);
        const normalizedCode = String(code || '').trim().toUpperCase();
        const normalizedName = String(name || '').trim();
        const normalizedResponsibilities = sanitizeResponsibilities(responsibilities);

        if (!normalizedCode) throw badRequest('Role code is required');
        if (!normalizedName) throw badRequest('Role name is required');

        await conn.beginTransaction();

        const [result] = await conn.query(
            `UPDATE team_roles
             SET code = ?, short_label = ?, name = ?, default_title = ?, ownership_summary = ?, sort_order = ?
             WHERE id = ?`,
            [
                normalizedCode,
                String(shortLabel || normalizedCode).trim(),
                normalizedName,
                String(defaultTitle || '').trim() || null,
                String(ownershipSummary || '').trim() || null,
                Number(sortOrder) || 0,
                teamRoleId
            ]
        );

        if (result.affectedRows === 0) {
            throw badRequest('Team role not found', 404);
        }

        await replaceResponsibilities(conn, teamRoleId, normalizedResponsibilities);
        await conn.commit();

        res.json({ success: true, message: 'Team role updated' });
    } catch (err) {
        await conn.rollback().catch(() => {});
        next(err);
    } finally {
        conn.release();
    }
};

exports.createDecisionRule = async (req, res, next) => {
    try {
        const { question, answer, sortOrder = 0 } = req.body;

        if (!question || !String(question).trim()) throw badRequest('Question is required');
        if (!answer || !String(answer).trim()) throw badRequest('Answer is required');

        await pool.query(
            `INSERT INTO team_decision_rules (question, answer, sort_order)
             VALUES (?, ?, ?)`,
            [String(question).trim(), String(answer).trim(), Number(sortOrder) || 0]
        );

        res.status(201).json({ success: true, message: 'Decision rule created' });
    } catch (err) {
        next(err);
    }
};

exports.updateDecisionRule = async (req, res, next) => {
    try {
        const { question, answer, sortOrder = 0 } = req.body;

        if (!question || !String(question).trim()) throw badRequest('Question is required');
        if (!answer || !String(answer).trim()) throw badRequest('Answer is required');

        const [result] = await pool.query(
            `UPDATE team_decision_rules
             SET question = ?, answer = ?, sort_order = ?
             WHERE id = ?`,
            [String(question).trim(), String(answer).trim(), Number(sortOrder) || 0, Number(req.params.id)]
        );

        if (result.affectedRows === 0) {
            throw badRequest('Decision rule not found', 404);
        }

        res.json({ success: true, message: 'Decision rule updated' });
    } catch (err) {
        next(err);
    }
};

exports.createTask = async (req, res, next) => {
    try {
        const {
            title,
            description = '',
            status = 'todo',
            priority = 'medium',
            assigneeUserId,
            dueDate = null
        } = req.body;

        if (!title || !String(title).trim()) throw badRequest('Task title is required');
        if (!TASK_STATUSES.has(status)) throw badRequest('Invalid task status');
        if (!TASK_PRIORITIES.has(priority)) throw badRequest('Invalid task priority');
        if (!assigneeUserId) throw badRequest('Assignee is required');

        const [assignees] = await pool.query(
            'SELECT id, full_name FROM users WHERE id = ? AND is_active = TRUE',
            [Number(assigneeUserId)]
        );
        if (assignees.length === 0) throw badRequest('Assignee not found', 404);

        await pool.query(
            `INSERT INTO team_tasks (title, description, status, priority, assignee_user_id, created_by_user_id, due_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                String(title).trim(),
                String(description || '').trim() || null,
                status,
                priority,
                Number(assigneeUserId),
                req.user.id,
                dueDate || null
            ]
        );

        await Notification.create({
            userId: Number(assigneeUserId),
            title: 'New team task assigned',
            description: `A new task, "${String(title).trim()}", has been assigned to you.`,
            type: 'info'
        });

        res.status(201).json({ success: true, message: 'Task created' });
    } catch (err) {
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const existing = await Team.getTaskById(Number(req.params.id));
        if (!existing) throw badRequest('Task not found', 404);

        const nextTask = {
            title: req.body.title !== undefined ? String(req.body.title).trim() : existing.title,
            description: req.body.description !== undefined ? String(req.body.description).trim() : existing.description,
            status: req.body.status || existing.status,
            priority: req.body.priority || existing.priority,
            assigneeUserId: req.body.assigneeUserId ? Number(req.body.assigneeUserId) : existing.assignee_user_id,
            dueDate: req.body.dueDate !== undefined ? req.body.dueDate : existing.due_date
        };

        if (!nextTask.title) throw badRequest('Task title is required');
        if (!TASK_STATUSES.has(nextTask.status)) throw badRequest('Invalid task status');
        if (!TASK_PRIORITIES.has(nextTask.priority)) throw badRequest('Invalid task priority');

        const [assignees] = await pool.query(
            'SELECT id FROM users WHERE id = ? AND is_active = TRUE',
            [nextTask.assigneeUserId]
        );
        if (assignees.length === 0) throw badRequest('Assignee not found', 404);

        await pool.query(
            `UPDATE team_tasks
             SET title = ?, description = ?, status = ?, priority = ?, assignee_user_id = ?, due_date = ?
             WHERE id = ?`,
            [
                nextTask.title,
                nextTask.description || null,
                nextTask.status,
                nextTask.priority,
                nextTask.assigneeUserId,
                nextTask.dueDate || null,
                Number(req.params.id)
            ]
        );

        if (existing.assignee_user_id !== nextTask.assigneeUserId) {
            await Notification.create({
                userId: nextTask.assigneeUserId,
                title: 'Task assignment updated',
                description: `You are now responsible for "${nextTask.title}".`,
                type: 'info'
            });
        }

        res.json({ success: true, message: 'Task updated' });
    } catch (err) {
        next(err);
    }
};

exports.updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!TASK_STATUSES.has(status)) throw badRequest('Invalid task status');

        const task = await Team.getTaskById(Number(req.params.id));
        if (!task) throw badRequest('Task not found', 404);

        if (req.user.role !== 'admin' && task.assignee_user_id !== req.user.id) {
            throw badRequest('You can only update your own tasks', 403);
        }

        await pool.query(
            'UPDATE team_tasks SET status = ? WHERE id = ?',
            [status, Number(req.params.id)]
        );

        if (task.created_by_user_id !== req.user.id) {
            await Notification.create({
                userId: task.created_by_user_id,
                title: 'Task progress updated',
                description: `${req.user.full_name} changed "${task.title}" to ${status.replace('_', ' ')}.`,
                type: 'info'
            });
        }

        res.json({ success: true, message: 'Task status updated' });
    } catch (err) {
        next(err);
    }
};

exports.createReport = async (req, res, next) => {
    try {
        if (!STAFF_ROLES.has(req.user.role)) {
            throw badRequest('Only staff accounts can submit reports', 403);
        }

        const { title, body, taskId = null, reportDate = new Date().toISOString().slice(0, 10) } = req.body;

        if (!title || !String(title).trim()) throw badRequest('Report title is required');
        if (!body || !String(body).trim()) throw badRequest('Report body is required');

        if (taskId) {
            const task = await Team.getTaskById(Number(taskId));
            if (!task) throw badRequest('Linked task not found', 404);
            if (req.user.role !== 'admin' && task.assignee_user_id !== req.user.id) {
                throw badRequest('You can only report against your own tasks', 403);
            }
        }

        await pool.query(
            `INSERT INTO team_reports (author_user_id, task_id, title, body, report_date)
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, taskId ? Number(taskId) : null, String(title).trim(), String(body).trim(), reportDate]
        );

        await notifyAdmins(
            'New staff report submitted',
            `${req.user.full_name} submitted "${String(title).trim()}" for review.`
        );

        res.status(201).json({ success: true, message: 'Report submitted' });
    } catch (err) {
        next(err);
    }
};

exports.reviewReport = async (req, res, next) => {
    try {
        const reportId = Number(req.params.id);
        const [rows] = await pool.query(
            'SELECT id, author_user_id, title, status FROM team_reports WHERE id = ?',
            [reportId]
        );
        if (rows.length === 0) throw badRequest('Report not found', 404);

        await pool.query(
            `UPDATE team_reports
             SET status = 'reviewed', reviewed_by_user_id = ?, reviewed_at = NOW()
             WHERE id = ?`,
            [req.user.id, reportId]
        );

        await Notification.create({
            userId: rows[0].author_user_id,
            title: 'Report reviewed',
            description: `Your report "${rows[0].title}" was reviewed by ${req.user.full_name}.`,
            type: 'success'
        });

        res.json({ success: true, message: 'Report reviewed' });
    } catch (err) {
        next(err);
    }
};

exports.createMoneyRequest = async (req, res, next) => {
    try {
        if (!STAFF_ROLES.has(req.user.role)) {
            throw badRequest('Only staff accounts can request money', 403);
        }

        const {
            title,
            amount,
            currency = 'RWF',
            paymentProvider = '',
            paymentReference = '',
            note = ''
        } = req.body;

        if (!title || !String(title).trim()) throw badRequest('Request title is required');
        if (!amount || Number(amount) <= 0) throw badRequest('Amount must be greater than zero');

        await pool.query(
            `INSERT INTO team_money_requests
             (source, beneficiary_user_id, initiated_by_user_id, title, amount, currency, payment_provider, payment_reference, note)
             VALUES ('staff_request', ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                req.user.id,
                String(title).trim(),
                Number(amount),
                String(currency || 'RWF').trim().toUpperCase(),
                String(paymentProvider || '').trim() || null,
                String(paymentReference || '').trim() || null,
                String(note || '').trim() || null
            ]
        );

        await notifyAdmins(
            'New staff money request',
            `${req.user.full_name} requested ${Number(amount).toFixed(2)} ${String(currency || 'RWF').trim().toUpperCase()} for "${String(title).trim()}".`
        );

        res.status(201).json({ success: true, message: 'Money request submitted' });
    } catch (err) {
        next(err);
    }
};

exports.createMoneyOffer = async (req, res, next) => {
    try {
        const {
            beneficiaryUserId,
            title,
            amount,
            currency = 'RWF',
            paymentProvider = '',
            paymentReference = '',
            note = '',
            status = 'approved'
        } = req.body;

        if (!beneficiaryUserId) throw badRequest('Beneficiary is required');
        if (!title || !String(title).trim()) throw badRequest('Offer title is required');
        if (!amount || Number(amount) <= 0) throw badRequest('Amount must be greater than zero');
        if (!['approved', 'paid', 'pending'].includes(status)) throw badRequest('Invalid initial offer status');

        const [beneficiaries] = await pool.query(
            'SELECT id, full_name FROM users WHERE id = ? AND is_active = TRUE',
            [Number(beneficiaryUserId)]
        );
        if (beneficiaries.length === 0) throw badRequest('Beneficiary not found', 404);

        const normalizedStatus = status;
        const reviewedByUserId = normalizedStatus === 'pending' ? null : req.user.id;
        const reviewedAt = normalizedStatus === 'pending' ? null : new Date();
        const paidAt = normalizedStatus === 'paid' ? new Date() : null;

        await pool.query(
            `INSERT INTO team_money_requests
             (source, beneficiary_user_id, initiated_by_user_id, title, amount, currency, payment_provider, payment_reference, note, status, reviewed_by_user_id, reviewed_at, paid_at)
             VALUES ('admin_offer', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Number(beneficiaryUserId),
                req.user.id,
                String(title).trim(),
                Number(amount),
                String(currency || 'RWF').trim().toUpperCase(),
                String(paymentProvider || '').trim() || null,
                String(paymentReference || '').trim() || null,
                String(note || '').trim() || null,
                normalizedStatus,
                reviewedByUserId,
                reviewedAt,
                paidAt
            ]
        );

        await Notification.create({
            userId: Number(beneficiaryUserId),
            title: 'Admin funding offer created',
            description: `${req.user.full_name} created a ${normalizedStatus === 'paid' ? 'paid' : normalizedStatus} offer of ${Number(amount).toFixed(2)} ${String(currency || 'RWF').trim().toUpperCase()} for "${String(title).trim()}".`,
            type: normalizedStatus === 'paid' ? 'success' : 'info'
        });

        res.status(201).json({ success: true, message: 'Money offer created' });
    } catch (err) {
        next(err);
    }
};

exports.updateMoneyRequestStatus = async (req, res, next) => {
    try {
        const requestId = Number(req.params.id);
        const { status, adminNote = '', paymentProvider = '', paymentReference = '' } = req.body;

        if (!MONEY_REQUEST_STATUSES.has(status)) {
            throw badRequest('Invalid money request status');
        }

        const [rows] = await pool.query(
            `SELECT id, beneficiary_user_id, title, amount, currency, status
             FROM team_money_requests
             WHERE id = ?`,
            [requestId]
        );
        if (rows.length === 0) throw badRequest('Money request not found', 404);

        await pool.query(
            `UPDATE team_money_requests
             SET status = ?,
                 admin_note = ?,
                 payment_provider = COALESCE(?, payment_provider),
                 payment_reference = COALESCE(?, payment_reference),
                 reviewed_by_user_id = ?,
                 reviewed_at = NOW(),
                 paid_at = CASE WHEN ? = 'paid' THEN NOW() ELSE paid_at END
             WHERE id = ?`,
            [
                status,
                String(adminNote || '').trim() || null,
                String(paymentProvider || '').trim() || null,
                String(paymentReference || '').trim() || null,
                req.user.id,
                status,
                requestId
            ]
        );

        const item = rows[0];
        await Notification.create({
            userId: item.beneficiary_user_id,
            title: 'Money request updated',
            description: `Your "${item.title}" request is now ${status}. Amount: ${Number(item.amount).toFixed(2)} ${item.currency}.`,
            type: status === 'rejected' ? 'warning' : status === 'paid' ? 'success' : 'info'
        });

        res.json({ success: true, message: 'Money request updated' });
    } catch (err) {
        next(err);
    }
};
