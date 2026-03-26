const pool = require('../config/db');

function mapTeamRoles(roles, responsibilities, assignmentCounts) {
    const responsibilityMap = responsibilities.reduce((acc, item) => {
        if (!acc[item.team_role_id]) acc[item.team_role_id] = [];
        acc[item.team_role_id].push(item);
        return acc;
    }, {});

    const countMap = assignmentCounts.reduce((acc, item) => {
        acc[item.team_role_id] = item.assignment_count;
        return acc;
    }, {});

    return roles.map((role) => ({
        ...role,
        assignment_count: countMap[role.id] || 0,
        responsibilities: (responsibilityMap[role.id] || []).map((item) => ({
            id: item.id,
            responsibility: item.responsibility,
            sort_order: item.sort_order
        }))
    }));
}

const Team = {
    async getRoles() {
        const [roles, responsibilities, assignmentCounts] = await Promise.all([
            pool.query('SELECT * FROM team_roles ORDER BY sort_order ASC, id ASC'),
            pool.query('SELECT * FROM team_role_responsibilities ORDER BY sort_order ASC, id ASC'),
            pool.query('SELECT team_role_id, COUNT(*) AS assignment_count FROM team_profiles WHERE team_role_id IS NOT NULL GROUP BY team_role_id')
        ]);

        return mapTeamRoles(roles[0], responsibilities[0], assignmentCounts[0]);
    },

    async getDecisionRules() {
        const [rows] = await pool.query(
            'SELECT * FROM team_decision_rules ORDER BY sort_order ASC, id ASC'
        );
        return rows;
    },

    async getMembers() {
        const [rows] = await pool.query(
            `SELECT
                u.id,
                u.full_name,
                u.email,
                u.phone_number,
                u.role,
                u.is_active,
                u.created_at,
                tp.id AS team_profile_id,
                tp.display_title,
                tp.staff_code,
                tp.bio,
                tp.ownership_summary,
                tr.id AS team_role_id,
                tr.code AS team_role_code,
                tr.short_label AS team_role_short_label,
                tr.name AS team_role_name,
                tr.default_title AS team_role_default_title
            FROM users u
            JOIN team_profiles tp ON tp.user_id = u.id
            LEFT JOIN team_roles tr ON tr.id = tp.team_role_id
            ORDER BY u.is_active DESC, COALESCE(tr.sort_order, 999), u.full_name ASC`
        );
        return rows;
    },

    async getRoster() {
        const [rows] = await pool.query(
            `SELECT
                u.id,
                u.full_name,
                u.email,
                u.role,
                tp.display_title,
                tp.staff_code,
                tr.code AS team_role_code,
                tr.short_label AS team_role_short_label,
                tr.name AS team_role_name
            FROM users u
            JOIN team_profiles tp ON tp.user_id = u.id
            LEFT JOIN team_roles tr ON tr.id = tp.team_role_id
            WHERE u.is_active = TRUE
            ORDER BY COALESCE(tr.sort_order, 999), u.full_name ASC`
        );
        return rows;
    },

    async getProfileByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT
                tp.id,
                tp.user_id,
                tp.display_title,
                tp.staff_code,
                tp.bio,
                tp.ownership_summary,
                tr.id AS team_role_id,
                tr.code AS team_role_code,
                tr.short_label AS team_role_short_label,
                tr.name AS team_role_name,
                tr.default_title AS team_role_default_title,
                tr.ownership_summary AS team_role_ownership_summary
            FROM team_profiles tp
            LEFT JOIN team_roles tr ON tr.id = tp.team_role_id
            WHERE tp.user_id = ?`,
            [userId]
        );
        return rows[0] || null;
    },

    async getTasks({ assigneeUserId, includeAll = false } = {}) {
        const params = [];
        let where = '';

        if (!includeAll && assigneeUserId) {
            where = 'WHERE tt.assignee_user_id = ?';
            params.push(assigneeUserId);
        }

        const [rows] = await pool.query(
            `SELECT
                tt.*,
                assignee.full_name AS assignee_name,
                assignee.email AS assignee_email,
                creator.full_name AS creator_name,
                creator.email AS creator_email
            FROM team_tasks tt
            JOIN users assignee ON assignee.id = tt.assignee_user_id
            JOIN users creator ON creator.id = tt.created_by_user_id
            ${where}
            ORDER BY
                CASE tt.status
                    WHEN 'blocked' THEN 1
                    WHEN 'in_progress' THEN 2
                    WHEN 'todo' THEN 3
                    ELSE 4
                END,
                CASE tt.priority
                    WHEN 'urgent' THEN 1
                    WHEN 'high' THEN 2
                    WHEN 'medium' THEN 3
                    ELSE 4
                END,
                tt.due_date IS NULL,
                tt.due_date ASC,
                tt.created_at DESC`,
            params
        );
        return rows;
    },

    async getTaskById(taskId) {
        const [rows] = await pool.query(
            `SELECT
                tt.*,
                assignee.full_name AS assignee_name,
                creator.full_name AS creator_name
            FROM team_tasks tt
            JOIN users assignee ON assignee.id = tt.assignee_user_id
            JOIN users creator ON creator.id = tt.created_by_user_id
            WHERE tt.id = ?`,
            [taskId]
        );
        return rows[0] || null;
    },

    async getReports({ authorUserId, includeAll = false } = {}) {
        const params = [];
        let where = '';

        if (!includeAll && authorUserId) {
            where = 'WHERE tr.author_user_id = ?';
            params.push(authorUserId);
        }

        const [rows] = await pool.query(
            `SELECT
                tr.*,
                author.full_name AS author_name,
                reviewer.full_name AS reviewer_name,
                tt.title AS task_title
            FROM team_reports tr
            JOIN users author ON author.id = tr.author_user_id
            LEFT JOIN users reviewer ON reviewer.id = tr.reviewed_by_user_id
            LEFT JOIN team_tasks tt ON tt.id = tr.task_id
            ${where}
            ORDER BY tr.created_at DESC`,
            params
        );
        return rows;
    },

    async getMoneyRequests({ userId, includeAll = false } = {}) {
        const params = [];
        let where = '';

        if (!includeAll && userId) {
            where = 'WHERE tmr.beneficiary_user_id = ?';
            params.push(userId);
        }

        const [rows] = await pool.query(
            `SELECT
                tmr.*,
                beneficiary.full_name AS beneficiary_name,
                beneficiary.email AS beneficiary_email,
                initiator.full_name AS initiator_name,
                reviewer.full_name AS reviewer_name
            FROM team_money_requests tmr
            JOIN users beneficiary ON beneficiary.id = tmr.beneficiary_user_id
            JOIN users initiator ON initiator.id = tmr.initiated_by_user_id
            LEFT JOIN users reviewer ON reviewer.id = tmr.reviewed_by_user_id
            ${where}
            ORDER BY
                CASE tmr.status
                    WHEN 'pending' THEN 1
                    WHEN 'approved' THEN 2
                    WHEN 'paid' THEN 3
                    ELSE 4
                END,
                tmr.created_at DESC`,
            params
        );
        return rows;
    },

    async getSummary() {
        const [[members], [tasks], [reports], [money]] = await Promise.all([
            pool.query('SELECT COUNT(*) AS total_members FROM team_profiles'),
            pool.query(
                `SELECT
                    SUM(CASE WHEN status <> 'completed' THEN 1 ELSE 0 END) AS open_tasks,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks
                FROM team_tasks`
            ),
            pool.query(
                `SELECT
                    SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS pending_reports,
                    COUNT(*) AS total_reports
                FROM team_reports`
            ),
            pool.query(
                `SELECT
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_money_requests,
                    SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_money_requests,
                    COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS total_paid_amount
                FROM team_money_requests`
            )
        ]);

        return {
            totalMembers: members[0].total_members || 0,
            openTasks: tasks[0].open_tasks || 0,
            completedTasks: tasks[0].completed_tasks || 0,
            pendingReports: reports[0].pending_reports || 0,
            totalReports: reports[0].total_reports || 0,
            pendingMoneyRequests: money[0].pending_money_requests || 0,
            paidMoneyRequests: money[0].paid_money_requests || 0,
            totalPaidAmount: Number(money[0].total_paid_amount || 0)
        };
    },

    async getWorkspace(userId) {
        const [profile, roles, decisionRules, tasks, reports, roster, moneyRequests] = await Promise.all([
            this.getProfileByUserId(userId),
            this.getRoles(),
            this.getDecisionRules(),
            this.getTasks({ assigneeUserId: userId }),
            this.getReports({ authorUserId: userId }),
            this.getRoster(),
            this.getMoneyRequests({ userId })
        ]);

        const assignedRole = profile?.team_role_id
            ? roles.find((role) => role.id === profile.team_role_id) || null
            : null;

        return {
            profile,
            assignedRole,
            roles,
            decisionRules,
            tasks,
            reports,
            moneyRequests,
            roster,
            summary: {
                assignedTasks: tasks.length,
                activeTasks: tasks.filter((task) => task.status !== 'completed').length,
                completedTasks: tasks.filter((task) => task.status === 'completed').length,
                submittedReports: reports.length
            },
            financeSummary: {
                pendingRequests: moneyRequests.filter((item) => item.status === 'pending').length,
                approvedRequests: moneyRequests.filter((item) => item.status === 'approved').length,
                paidRequests: moneyRequests.filter((item) => item.status === 'paid').length,
                totalPaidAmount: moneyRequests
                    .filter((item) => item.status === 'paid')
                    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
            }
        };
    }
};

module.exports = Team;
