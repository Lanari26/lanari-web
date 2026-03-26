const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUserRole, toggleUserActive, getAnalytics } = require('../controllers/admin.controller');
const {
    getAdminTeamOverview,
    createTeamMember,
    updateTeamMember,
    createTeamRole,
    updateTeamRole,
    createDecisionRule,
    updateDecisionRule,
    createTask,
    updateTask,
    reviewReport,
    createMoneyOffer,
    updateMoneyRequestStatus
} = require('../controllers/team.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/team/overview', getAdminTeamOverview);
router.post('/team/members', createTeamMember);
router.patch('/team/members/:id', updateTeamMember);
router.post('/team/roles', createTeamRole);
router.put('/team/roles/:id', updateTeamRole);
router.post('/team/decision-rules', createDecisionRule);
router.put('/team/decision-rules/:id', updateDecisionRule);
router.post('/team/tasks', createTask);
router.patch('/team/tasks/:id', updateTask);
router.patch('/team/reports/:id/review', reviewReport);
router.post('/team/money-requests/offers', createMoneyOffer);
router.patch('/team/money-requests/:id', updateMoneyRequestStatus);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/toggle', toggleUserActive);

module.exports = router;
