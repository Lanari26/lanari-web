import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL;
const taskStatuses = ['todo', 'in_progress', 'blocked', 'completed'];

function Badge({ children, tone = 'blue' }) {
    const tones = {
        blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        pink: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
        gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${tones[tone] || tones.blue}`}>
            {children}
        </span>
    );
}

export default function TeamWorkspace({ workspace }) {
    const [data, setData] = useState(workspace);
    const [form, setForm] = useState({ title: '', body: '', taskId: '' });
    const [moneyForm, setMoneyForm] = useState({ title: '', amount: '', currency: 'RWF', paymentProvider: '', paymentReference: '', note: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setData(workspace);
    }, [workspace]);

    if (!data) return null;

    const token = localStorage.getItem('token');
    const assignedRole = data.assignedRole;
    const ownershipSummary = data.profile?.ownership_summary || assignedRole?.ownership_summary || assignedRole?.team_role_ownership_summary;

    const updateTaskStatus = async (taskId, status) => {
        setError('');
        const previousData = data;
        const nextTasks = data.tasks.map((task) => task.id === taskId ? { ...task, status } : task);
        setData((prev) => ({
            ...prev,
            tasks: nextTasks,
            summary: {
                ...prev.summary,
                activeTasks: nextTasks.filter((task) => task.status !== 'completed').length,
                completedTasks: nextTasks.filter((task) => task.status === 'completed').length
            }
        }));

        try {
            const res = await fetch(`${API}/team/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.error || 'Failed to update task');
        } catch (err) {
            setError(err.message);
            setData(previousData);
        }
    };

    const submitReport = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.body.trim()) return;

        setSaving(true);
        setError('');
        try {
            const res = await fetch(`${API}/team/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: form.title.trim(),
                    body: form.body.trim(),
                    taskId: form.taskId || null
                })
            });
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.error || 'Failed to submit report');

            const report = {
                id: `draft-${Date.now()}`,
                title: form.title.trim(),
                body: form.body.trim(),
                status: 'submitted',
                task_title: data.tasks.find((task) => String(task.id) === form.taskId)?.title || null,
                report_date: new Date().toISOString(),
                created_at: new Date().toISOString(),
                author_name: 'You'
            };

            setData((prev) => ({
                ...prev,
                reports: [report, ...prev.reports],
                summary: {
                    ...prev.summary,
                    submittedReports: prev.summary.submittedReports + 1
                }
            }));
            setForm({ title: '', body: '', taskId: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const submitMoneyRequest = async (e) => {
        e.preventDefault();
        if (!moneyForm.title.trim() || !moneyForm.amount) return;

        setSaving(true);
        setError('');
        try {
            const res = await fetch(`${API}/team/money-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: moneyForm.title.trim(),
                    amount: Number(moneyForm.amount),
                    currency: moneyForm.currency.trim().toUpperCase(),
                    paymentProvider: moneyForm.paymentProvider.trim(),
                    paymentReference: moneyForm.paymentReference.trim(),
                    note: moneyForm.note.trim()
                })
            });
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.error || 'Failed to submit money request');

            const request = {
                id: `money-${Date.now()}`,
                title: moneyForm.title.trim(),
                amount: Number(moneyForm.amount),
                currency: moneyForm.currency.trim().toUpperCase(),
                payment_provider: moneyForm.paymentProvider.trim(),
                payment_reference: moneyForm.paymentReference.trim(),
                note: moneyForm.note.trim(),
                status: 'pending',
                source: 'staff_request',
                created_at: new Date().toISOString()
            };

            setData((prev) => ({
                ...prev,
                moneyRequests: [request, ...(prev.moneyRequests || [])],
                financeSummary: {
                    ...prev.financeSummary,
                    pendingRequests: (prev.financeSummary?.pendingRequests || 0) + 1
                }
            }));
            setMoneyForm({ title: '', amount: '', currency: 'RWF', paymentProvider: '', paymentReference: '', note: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-white">Team Workspace</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Track your lane, keep tasks moving, and submit written reports without leaving the dashboard.
                    </p>
                </div>
                {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Assigned Tasks', value: data.summary.assignedTasks, tone: 'blue' },
                    { label: 'Active Tasks', value: data.summary.activeTasks, tone: 'amber' },
                    { label: 'Completed Tasks', value: data.summary.completedTasks, tone: 'emerald' },
                    { label: 'Reports Sent', value: data.summary.submittedReports, tone: 'pink' },
                    { label: 'Pending Money', value: data.financeSummary?.pendingRequests || 0, tone: 'blue' },
                    { label: 'Paid Money', value: data.financeSummary?.paidRequests || 0, tone: 'emerald' }
                ].map((item) => (
                    <div key={item.label} className="p-5 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <div className={`text-3xl font-bold ${item.tone === 'blue' ? 'text-blue-400' : item.tone === 'amber' ? 'text-amber-400' : item.tone === 'emerald' ? 'text-emerald-400' : 'text-pink-400'}`}>
                            {item.value}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">{item.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr,0.85fr] gap-6">
                <section className="rounded-3xl p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {assignedRole?.code && <Badge>{assignedRole.code}</Badge>}
                        <Badge tone="gray">{data.profile?.display_title || assignedRole?.default_title || 'Staff member'}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white">{assignedRole?.name || 'Team member'}</h3>
                    {ownershipSummary && <p className="text-sm text-gray-400 mt-3 leading-relaxed">{ownershipSummary}</p>}

                    <div className="mt-5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-3">Responsibilities</p>
                        <div className="flex flex-wrap gap-2">
                            {(assignedRole?.responsibilities || []).map((item) => (
                                <Badge key={item.id} tone="gray">{item.responsibility}</Badge>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-3">Team Roster</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {data.roster.map((member) => (
                                <div key={member.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                    <div className="text-sm font-bold text-white">{member.full_name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {member.team_role_code ? `${member.team_role_code} · ` : ''}{member.display_title || member.team_role_name || member.role}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <h3 className="text-lg font-bold text-white mb-4">Decision Rules</h3>
                    <div className="space-y-3">
                        {data.decisionRules.map((rule) => (
                            <div key={rule.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                <div className="text-sm font-bold text-white">{rule.question}</div>
                                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{rule.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr,0.9fr] gap-6">
                <section className="rounded-3xl p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Assigned Tasks</h3>
                        <Badge tone="gray">{data.tasks.length} total</Badge>
                    </div>
                    <div className="space-y-4">
                        {data.tasks.length === 0 && (
                            <div className="rounded-2xl p-8 text-center text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                No tasks assigned yet.
                            </div>
                        )}
                        {data.tasks.map((task) => (
                            <div key={task.id} className="rounded-2xl p-5" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-base font-bold text-white">{task.title}</h4>
                                            <Badge tone={task.priority === 'urgent' ? 'pink' : task.priority === 'high' ? 'amber' : 'gray'}>
                                                {task.priority}
                                            </Badge>
                                        </div>
                                        {task.description && <p className="text-sm text-gray-400 mt-3 leading-relaxed whitespace-pre-wrap">{task.description}</p>}
                                        <div className="text-xs text-gray-500 mt-3">
                                            {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'} · Assigned by {task.creator_name}
                                        </div>
                                    </div>
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                        className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                                    >
                                        {taskStatuses.map((status) => (
                                            <option key={status} value={status}>{status.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <h3 className="text-lg font-bold text-white mb-4">Submit Report</h3>
                    <form onSubmit={submitReport} className="space-y-4">
                        <input
                            value={form.title}
                            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Report title"
                            className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                        />
                        <select
                            value={form.taskId}
                            onChange={(e) => setForm((prev) => ({ ...prev, taskId: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                        >
                            <option value="">Link to a task (optional)</option>
                            {data.tasks.map((task) => (
                                <option key={task.id} value={task.id}>{task.title}</option>
                            ))}
                        </select>
                        <textarea
                            value={form.body}
                            onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
                            placeholder="Write progress, blockers, decisions, and next steps."
                            className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-36"
                        />
                        <button disabled={saving} className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold disabled:opacity-50">
                            {saving ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-3">Recent Reports</h4>
                        <div className="space-y-3">
                            {data.reports.length === 0 && (
                                <div className="rounded-2xl p-4 text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                    No reports sent yet.
                                </div>
                            )}
                            {data.reports.map((report) => (
                                <div key={report.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-bold text-white">{report.title}</div>
                                        <Badge tone={report.status === 'reviewed' ? 'emerald' : 'amber'}>
                                            {report.status}
                                        </Badge>
                                    </div>
                                    {report.task_title && <div className="text-xs text-gray-500 mt-1">Task: {report.task_title}</div>}
                                    <p className="text-sm text-gray-400 mt-3 whitespace-pre-wrap">{report.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[0.95fr,1.05fr] gap-6">
                <section className="rounded-3xl p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <h3 className="text-lg font-bold text-white mb-4">Request Money</h3>
                    <form onSubmit={submitMoneyRequest} className="space-y-4">
                        <input
                            value={moneyForm.title}
                            onChange={(e) => setMoneyForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="What is the money for?"
                            className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                value={moneyForm.amount}
                                onChange={(e) => setMoneyForm((prev) => ({ ...prev, amount: e.target.value }))}
                                placeholder="Amount"
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                            />
                            <input
                                value={moneyForm.currency}
                                onChange={(e) => setMoneyForm((prev) => ({ ...prev, currency: e.target.value.toUpperCase() }))}
                                placeholder="Currency"
                                className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                value={moneyForm.paymentProvider}
                                onChange={(e) => setMoneyForm((prev) => ({ ...prev, paymentProvider: e.target.value }))}
                                placeholder="Provider or channel (MBS, MoMo, bank...)"
                                className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                            />
                            <input
                                value={moneyForm.paymentReference}
                                onChange={(e) => setMoneyForm((prev) => ({ ...prev, paymentReference: e.target.value }))}
                                placeholder="Wallet / account / reference"
                                className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none"
                            />
                        </div>
                        <textarea
                            value={moneyForm.note}
                            onChange={(e) => setMoneyForm((prev) => ({ ...prev, note: e.target.value }))}
                            placeholder="Explain why you need the funds and any disbursement notes."
                            className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28"
                        />
                        <button disabled={saving} className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold disabled:opacity-50">
                            {saving ? 'Submitting...' : 'Submit Money Request'}
                        </button>
                    </form>
                </section>

                <section className="rounded-3xl p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <h3 className="text-lg font-bold text-white mb-4">Money Requests And Offers</h3>
                    <div className="space-y-3">
                        {(data.moneyRequests || []).length === 0 && (
                            <div className="rounded-2xl p-4 text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                No money requests or offers yet.
                            </div>
                        )}
                        {(data.moneyRequests || []).map((item) => (
                            <div key={item.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-sm font-bold text-white">{item.title}</div>
                                    <Badge tone={item.status === 'paid' ? 'emerald' : item.status === 'rejected' ? 'pink' : item.status === 'approved' ? 'blue' : 'amber'}>
                                        {item.status}
                                    </Badge>
                                    <Badge tone="gray">{item.source === 'admin_offer' ? 'admin offer' : 'staff request'}</Badge>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {Number(item.amount).toFixed(2)} {item.currency}
                                    {item.payment_provider ? ` · ${item.payment_provider}` : ''}
                                    {item.payment_reference ? ` · ${item.payment_reference}` : ''}
                                </div>
                                {item.note && <p className="text-sm text-gray-400 mt-3 whitespace-pre-wrap">{item.note}</p>}
                                {item.admin_note && <p className="text-xs text-cyan-300 mt-3">Admin note: {item.admin_note}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
