import React, { useEffect, useState } from 'react';
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

function Section({ title, subtitle, children }) {
    return (
        <section className="rounded-3xl p-5 sm:p-6" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <div className="mb-5">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                {subtitle && <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {children}
        </section>
    );
}

export default function Team() {
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
    const [memberForm, setMemberForm] = useState(emptyMemberForm);
    const [roleForm, setRoleForm] = useState(emptyRoleForm);
    const [ruleForm, setRuleForm] = useState(emptyRuleForm);
    const [taskForm, setTaskForm] = useState(emptyTaskForm);
    const [moneyOfferForm, setMoneyOfferForm] = useState(emptyMoneyOfferForm);

    const load = async () => {
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
    };

    useEffect(() => {
        load();
    }, []);

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

    const createMember = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/members', {
                ...memberForm,
                teamRoleId: memberForm.teamRoleId || null
            }),
            () => setMemberForm(emptyMemberForm)
        );
    };

    const saveMember = (member) => runAction(() => api.patch(`/admin/team/members/${member.id}`, {
        fullName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        role: member.role,
        isActive: member.isActive,
        teamRoleId: member.teamRoleId || null,
        displayTitle: member.displayTitle,
        staffCode: member.staffCode,
        bio: member.bio,
        ownershipSummary: member.ownershipSummary
    }));

    const createRole = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/roles', {
                ...roleForm,
                responsibilities: toResponsibilities(roleForm.responsibilitiesText)
            }),
            () => setRoleForm(emptyRoleForm)
        );
    };

    const saveRole = (role) => runAction(() => api.put(`/admin/team/roles/${role.id}`, {
        code: role.code,
        shortLabel: role.shortLabel,
        name: role.name,
        defaultTitle: role.defaultTitle,
        ownershipSummary: role.ownershipSummary,
        sortOrder: role.sort_order,
        responsibilities: toResponsibilities(role.responsibilitiesText)
    }));

    const createRule = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/decision-rules', ruleForm),
            () => setRuleForm(emptyRuleForm)
        );
    };

    const saveRule = (rule) => runAction(() => api.put(`/admin/team/decision-rules/${rule.id}`, {
        question: rule.question,
        answer: rule.answer,
        sortOrder: rule.sortOrder
    }));

    const createTask = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/tasks', {
                ...taskForm,
                assigneeUserId: Number(taskForm.assigneeUserId),
                dueDate: taskForm.dueDate || null
            }),
            () => setTaskForm(emptyTaskForm)
        );
    };

    const saveTask = (task) => runAction(() => api.patch(`/admin/team/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assigneeUserId: Number(task.assigneeUserId),
        dueDate: task.dueDate || null
    }));

    const reviewReport = (reportId) => runAction(() => api.patch(`/admin/team/reports/${reportId}/review`));

    const createMoneyOffer = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/money-requests/offers', {
                ...moneyOfferForm,
                beneficiaryUserId: Number(moneyOfferForm.beneficiaryUserId),
                amount: Number(moneyOfferForm.amount)
            }),
            () => setMoneyOfferForm(emptyMoneyOfferForm)
        );
    };

    const saveMoneyRequest = (request) => runAction(() => api.patch(`/admin/team/money-requests/${request.id}`, {
        status: request.status,
        adminNote: request.adminNote,
        paymentProvider: request.paymentProvider,
        paymentReference: request.paymentReference
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Team Management</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Build the staff structure from scratch, keep the default ownership map, and run tasks plus reporting in one workflow.
                    </p>
                </div>
                {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
            </div>

            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        { label: 'Team Members', value: summary.totalMembers, accent: 'text-blue-400' },
                        { label: 'Open Tasks', value: summary.openTasks, accent: 'text-amber-400' },
                        { label: 'Completed Tasks', value: summary.completedTasks, accent: 'text-emerald-400' },
                        { label: 'Pending Reports', value: summary.pendingReports, accent: 'text-pink-400' },
                        { label: 'Pending Money', value: summary.pendingMoneyRequests, accent: 'text-cyan-400' },
                        { label: 'Paid Requests', value: summary.paidMoneyRequests, accent: 'text-violet-400' },
                        { label: 'Total Paid', value: `${Number(summary.totalPaidAmount || 0).toFixed(2)} RWF`, accent: 'text-lime-400' }
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className={`text-3xl font-bold ${item.accent}`}>{item.value}</div>
                            <div className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wider">{item.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Section title="Create Staff Account" subtitle="Admins can add staff directly without waiting for public registration.">
                    <form onSubmit={createMember} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={memberForm.fullName} onChange={(e) => setMemberForm((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Full name" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <input value={memberForm.email} onChange={(e) => setMemberForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <input value={memberForm.phoneNumber} onChange={(e) => setMemberForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="Phone number" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <input value={memberForm.password} onChange={(e) => setMemberForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Temporary password" type="password" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <select value={memberForm.role} onChange={(e) => setMemberForm((prev) => ({ ...prev, role: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select value={memberForm.teamRoleId} onChange={(e) => setMemberForm((prev) => ({ ...prev, teamRoleId: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                            <option value="">Select ownership seat</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.code} · {role.name}</option>
                            ))}
                        </select>
                        <input value={memberForm.displayTitle} onChange={(e) => setMemberForm((prev) => ({ ...prev, displayTitle: e.target.value }))} placeholder="Display title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <input value={memberForm.staffCode} onChange={(e) => setMemberForm((prev) => ({ ...prev, staffCode: e.target.value }))} placeholder="Staff code" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <textarea value={memberForm.bio} onChange={(e) => setMemberForm((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Bio or context" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                        <textarea value={memberForm.ownershipSummary} onChange={(e) => setMemberForm((prev) => ({ ...prev, ownershipSummary: e.target.value }))} placeholder="Optional member-specific ownership summary" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                        <button disabled={saving} className="sm:col-span-2 rounded-xl px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold disabled:opacity-50">
                            {saving ? 'Saving...' : 'Create Staff Member'}
                        </button>
                    </form>
                </Section>

                <Section title="Assign Task" subtitle="Tasks can be routed by admin and then updated by the assignee in their workspace.">
                    <form onSubmit={createTask} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={taskForm.title} onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Task title" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <textarea value={taskForm.description} onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Task description" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                        <select value={taskForm.assigneeUserId} onChange={(e) => setTaskForm((prev) => ({ ...prev, assigneeUserId: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                            <option value="">Assign to...</option>
                            {members.filter((member) => member.isActive).map((member) => (
                                <option key={member.id} value={member.id}>{member.fullName}</option>
                            ))}
                        </select>
                        <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                        <select value={taskForm.priority} onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                            {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                        <select value={taskForm.status} onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                            {statusOptions.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}
                        </select>
                        <button disabled={saving} className="sm:col-span-2 rounded-xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold disabled:opacity-50">
                            {saving ? 'Saving...' : 'Create Task'}
                        </button>
                    </form>
                </Section>
            </div>

            <Section title="Offer Money" subtitle="Admins can proactively offer or disburse money to staff through any provider or custom channel.">
                <form onSubmit={createMoneyOffer} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <select value={moneyOfferForm.beneficiaryUserId} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, beneficiaryUserId: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                        <option value="">Choose staff member</option>
                        {members.filter((member) => member.isActive).map((member) => (
                            <option key={member.id} value={member.id}>{member.fullName}</option>
                        ))}
                    </select>
                    <input value={moneyOfferForm.title} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Offer title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.amount} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Amount" type="number" min="0" step="0.01" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.currency} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, currency: e.target.value.toUpperCase() }))} placeholder="Currency" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.paymentProvider} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, paymentProvider: e.target.value }))} placeholder="Provider or channel (MBS, MoMo, bank...)" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.paymentReference} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, paymentReference: e.target.value }))} placeholder="Wallet / account / reference" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <select value={moneyOfferForm.status} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, status: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                        <option value="approved">Approved offer</option>
                        <option value="paid">Already paid</option>
                        <option value="pending">Pending review</option>
                    </select>
                    <div />
                    <textarea value={moneyOfferForm.note} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, note: e.target.value }))} placeholder="Why this money is being offered" className="sm:col-span-2 xl:col-span-4 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                    <button disabled={saving} className="sm:col-span-2 xl:col-span-4 rounded-xl px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold disabled:opacity-50">
                        {saving ? 'Saving...' : 'Create Admin Offer'}
                    </button>
                </form>
            </Section>

            <Section title="Team Members" subtitle="Every staff profile can carry an ownership seat, operating title, and member-specific notes.">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {members.map((member, index) => (
                        <div key={member.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-lg font-bold text-white">{member.fullName}</div>
                                    <div className="text-xs font-medium text-gray-500">{member.email}</div>
                                </div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                    <input
                                        type="checkbox"
                                        checked={member.isActive}
                                        onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, isActive: e.target.checked } : item))}
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input value={member.fullName} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, fullName: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={member.phoneNumber} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, phoneNumber: e.target.value } : item))} placeholder="Phone" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={member.email} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, email: e.target.value } : item))} className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <select value={member.role} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, role: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <select value={member.teamRoleId} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, teamRoleId: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    <option value="">No ownership seat</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.code} · {role.name}</option>
                                    ))}
                                </select>
                                <input value={member.displayTitle} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, displayTitle: e.target.value } : item))} placeholder="Display title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={member.staffCode} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, staffCode: e.target.value } : item))} placeholder="Staff code" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <textarea value={member.bio} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, bio: e.target.value } : item))} placeholder="Bio" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                                <textarea value={member.ownershipSummary} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, ownershipSummary: e.target.value } : item))} placeholder="Member-specific ownership summary" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                            </div>
                            <button onClick={() => saveMember(member)} disabled={saving} className="rounded-xl px-4 py-3 bg-blue-600 text-white font-bold disabled:opacity-50">
                                Save Member
                            </button>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Ownership Map" subtitle="Default seats ship preloaded, but every role stays editable and you can add more custom seats.">
                <form onSubmit={createRole} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <input value={roleForm.code} onChange={(e) => setRoleForm((prev) => ({ ...prev, code: e.target.value }))} placeholder="Code" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={roleForm.shortLabel} onChange={(e) => setRoleForm((prev) => ({ ...prev, shortLabel: e.target.value }))} placeholder="Short label" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={roleForm.name} onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Role name" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={roleForm.defaultTitle} onChange={(e) => setRoleForm((prev) => ({ ...prev, defaultTitle: e.target.value }))} placeholder="Default title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input type="number" value={roleForm.sortOrder} onChange={(e) => setRoleForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))} placeholder="Sort order" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <div />
                    <textarea value={roleForm.ownershipSummary} onChange={(e) => setRoleForm((prev) => ({ ...prev, ownershipSummary: e.target.value }))} placeholder="Ownership summary" className="lg:col-span-3 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                    <textarea value={roleForm.responsibilitiesText} onChange={(e) => setRoleForm((prev) => ({ ...prev, responsibilitiesText: e.target.value }))} placeholder="One responsibility per line" className="lg:col-span-3 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                    <button disabled={saving} className="lg:col-span-3 rounded-xl px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold disabled:opacity-50">
                        {saving ? 'Saving...' : 'Add Custom Role'}
                    </button>
                </form>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {roles.map((role, index) => (
                        <div key={role.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em]">{role.code}</div>
                                    <div className="text-lg font-bold text-white mt-1">{role.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{role.assignment_count} assigned member{role.assignment_count !== 1 ? 's' : ''}</div>
                                </div>
                                <button onClick={() => saveRole(role)} disabled={saving} className="rounded-xl px-4 py-2 bg-blue-600 text-white text-sm font-bold disabled:opacity-50">
                                    Save
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input value={role.code} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, code: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={role.shortLabel} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, shortLabel: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={role.name} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={role.defaultTitle} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, defaultTitle: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input type="number" value={role.sort_order} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, sort_order: Number(e.target.value) } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                            </div>
                            <textarea value={role.ownershipSummary} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, ownershipSummary: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                            <textarea value={role.responsibilitiesText} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, responsibilitiesText: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Decision Rules" subtitle="These are the standing answers that remove ambiguity before each sprint.">
                <form onSubmit={createRule} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <input value={ruleForm.question} onChange={(e) => setRuleForm((prev) => ({ ...prev, question: e.target.value }))} placeholder="Question" className="lg:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input type="number" value={ruleForm.sortOrder} onChange={(e) => setRuleForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))} placeholder="Sort order" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <textarea value={ruleForm.answer} onChange={(e) => setRuleForm((prev) => ({ ...prev, answer: e.target.value }))} placeholder="Answer" className="lg:col-span-3 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                    <button disabled={saving} className="lg:col-span-3 rounded-xl px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold disabled:opacity-50">
                        {saving ? 'Saving...' : 'Add Decision Rule'}
                    </button>
                </form>

                <div className="space-y-4">
                    {decisionRules.map((rule, index) => (
                        <div key={rule.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr,140px,120px] gap-3">
                                <input value={rule.question} onChange={(e) => setDecisionRules((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, question: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input type="number" value={rule.sortOrder} onChange={(e) => setDecisionRules((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, sortOrder: Number(e.target.value) } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <button onClick={() => saveRule(rule)} disabled={saving} className="rounded-xl px-4 py-3 bg-blue-600 text-white font-bold disabled:opacity-50">
                                    Save Rule
                                </button>
                            </div>
                            <textarea value={rule.answer} onChange={(e) => setDecisionRules((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, answer: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Task Board" subtitle="Admins can rebalance assignments here; staff will see the same tasks inside their workspace.">
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <div key={task.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                                <input value={task.title} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item))} className="lg:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <select value={task.assigneeUserId} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, assigneeUserId: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {members.filter((member) => member.isActive).map((member) => (
                                        <option key={member.id} value={member.id}>{member.fullName}</option>
                                    ))}
                                </select>
                                <input type="date" value={task.dueDate} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, dueDate: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                            </div>
                            <textarea value={task.description || ''} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                                <select value={task.status} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, status: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {statusOptions.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}
                                </select>
                                <select value={task.priority} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, priority: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                                <div className="rounded-xl px-4 py-3 bg-gray-950 border border-gray-700 text-sm text-gray-400">
                                    Created by {task.creator_name}
                                </div>
                                <button onClick={() => saveTask(task)} disabled={saving} className="rounded-xl px-4 py-3 bg-blue-600 text-white font-bold disabled:opacity-50">
                                    Save Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Money Requests And Offers" subtitle="Staff can request funds; admins can approve, reject, mark paid, or issue direct offers.">
                <div className="space-y-4">
                    {moneyRequests.length === 0 && (
                        <div className="rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No money activity yet.
                        </div>
                    )}
                    {moneyRequests.map((request, index) => (
                        <div key={request.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold text-white">{request.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                                            request.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' :
                                            request.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                                            request.status === 'approved' ? 'bg-blue-500/15 text-blue-400' :
                                            'bg-amber-500/15 text-amber-400'
                                        }`}>
                                            {request.status}
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-300">
                                            {request.source === 'admin_offer' ? 'admin offer' : 'staff request'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        For {request.beneficiary_name} · {Number(request.amount).toFixed(2)} {request.currency}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Initiated by {request.initiator_name} · {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                    {request.note && <p className="text-sm text-gray-300 mt-3 whitespace-pre-wrap">{request.note}</p>}
                                    {request.reviewer_name && (
                                        <p className="text-xs text-emerald-400 mt-3 font-semibold">Last reviewed by {request.reviewer_name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                <select value={request.status} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, status: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {moneyStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                                <input value={request.paymentProvider} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, paymentProvider: e.target.value } : item))} placeholder="Provider / channel" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={request.paymentReference} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, paymentReference: e.target.value } : item))} placeholder="Payment reference" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <button onClick={() => saveMoneyRequest(request)} disabled={saving} className="rounded-xl px-4 py-3 bg-cyan-600 text-white font-bold disabled:opacity-50">
                                    Save Money Status
                                </button>
                            </div>
                            <textarea value={request.adminNote} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, adminNote: e.target.value } : item))} placeholder="Admin note for approval, rejection, or payout context" className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-20" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Reports Feed" subtitle="Submitted reports arrive here for admin review and close the loop with the team.">
                <div className="space-y-4">
                    {reports.length === 0 && (
                        <div className="rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No reports submitted yet.
                        </div>
                    )}
                    {reports.map((report) => (
                        <div key={report.id} className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold text-white">{report.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${report.status === 'reviewed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {report.author_name} · {new Date(report.report_date).toLocaleDateString()} {report.task_title ? `· Linked to "${report.task_title}"` : ''}
                                    </p>
                                    <p className="text-sm text-gray-300 mt-4 leading-relaxed whitespace-pre-wrap">{report.body}</p>
                                    {report.reviewer_name && (
                                        <p className="text-xs text-emerald-400 font-semibold mt-3">
                                            Reviewed by {report.reviewer_name}
                                        </p>
                                    )}
                                </div>
                                {report.status !== 'reviewed' && (
                                    <button onClick={() => reviewReport(report.id)} disabled={saving} className="rounded-xl px-4 py-3 bg-emerald-600 text-white font-bold disabled:opacity-50">
                                        Mark Reviewed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
