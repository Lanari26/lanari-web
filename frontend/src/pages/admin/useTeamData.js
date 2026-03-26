import { useEffect, useState, useCallback } from 'react';
import { api } from './api';

const emptyMemberForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'employee',
    teamRoleId: '',
    displayTitle: '',
    staffCode: '',
    bio: '',
    ownershipSummary: ''
};

const emptyRoleForm = {
    code: '',
    shortLabel: '',
    name: '',
    defaultTitle: '',
    ownershipSummary: '',
    responsibilitiesText: '',
    sortOrder: 0
};

const emptyRuleForm = {
    question: '',
    answer: '',
    sortOrder: 0
};

const emptyTaskForm = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assigneeUserId: '',
    dueDate: ''
};

const emptyMoneyOfferForm = {
    beneficiaryUserId: '',
    title: '',
    amount: '',
    currency: 'RWF',
    paymentProvider: '',
    paymentReference: '',
    note: '',
    status: 'approved'
};

const statusOptions = ['todo', 'in_progress', 'blocked', 'completed'];
const priorityOptions = ['low', 'medium', 'high', 'urgent'];
const moneyStatusOptions = ['pending', 'approved', 'rejected', 'paid'];

function toResponsibilities(text) {
    return String(text || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
}

function mapOverviewPayload(payload) {
    return {
        summary: payload.summary,
        members: payload.members.map((member) => ({
            ...member,
            teamRoleId: member.team_role_id || '',
            displayTitle: member.display_title || '',
            staffCode: member.staff_code || '',
            bio: member.bio || '',
            ownershipSummary: member.ownership_summary || '',
            fullName: member.full_name,
            phoneNumber: member.phone_number || '',
            isActive: Boolean(member.is_active)
        })),
        roles: payload.roles.map((role) => ({
            ...role,
            shortLabel: role.short_label,
            defaultTitle: role.default_title || '',
            ownershipSummary: role.ownership_summary || '',
            responsibilitiesText: role.responsibilities.map((item) => item.responsibility).join('\n')
        })),
        decisionRules: payload.decisionRules.map((rule) => ({
            ...rule,
            sortOrder: rule.sort_order
        })),
        tasks: payload.tasks.map((task) => ({
            ...task,
            assigneeUserId: task.assignee_user_id,
            dueDate: task.due_date ? new Date(task.due_date).toISOString().slice(0, 10) : ''
        })),
        reports: payload.reports,
        moneyRequests: payload.moneyRequests.map((item) => ({
            ...item,
            beneficiaryUserId: item.beneficiary_user_id,
            amount: Number(item.amount),
            currency: item.currency || 'RWF',
            paymentProvider: item.payment_provider || '',
            paymentReference: item.payment_reference || '',
            adminNote: item.admin_note || ''
        }))
    };
}

export {
    emptyMemberForm,
    emptyRoleForm,
    emptyRuleForm,
    emptyTaskForm,
    emptyMoneyOfferForm,
    statusOptions,
    priorityOptions,
    moneyStatusOptions,
    toResponsibilities
};

export default function useTeamData() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState(null);
    const [members, setMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [decisionRules, setDecisionRules] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [reports, setReports] = useState([]);
    const [moneyRequests, setMoneyRequests] = useState([]);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/admin/team/overview');
            const next = mapOverviewPayload(res.data);
            setSummary(next.summary);
            setMembers(next.members);
            setRoles(next.roles);
            setDecisionRules(next.decisionRules);
            setTasks(next.tasks);
            setReports(next.reports);
            setMoneyRequests(next.moneyRequests);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const runAction = async (action, reset) => {
        setSaving(true);
        setError('');
        try {
            await action();
            if (typeof reset === 'function') reset();
            await load();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return {
        loading, saving, error,
        summary,
        members, setMembers,
        roles, setRoles,
        decisionRules, setDecisionRules,
        tasks, setTasks,
        reports,
        moneyRequests, setMoneyRequests,
        runAction, load
    };
}
