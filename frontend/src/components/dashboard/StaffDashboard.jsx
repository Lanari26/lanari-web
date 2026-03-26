import React from 'react';

function Badge({ children, tone = 'blue' }) {
    const tones = {
        blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        pink: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
        slate: 'bg-slate-500/10 text-slate-300 border-slate-500/20'
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${tones[tone] || tones.blue}`}>
            {children}
        </span>
    );
}

function Section({ title, subtitle, action, children }) {
    return (
        <section className="rounded-3xl p-5 sm:p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export default function StaffDashboard({ user, workspace, notifications, unreadNotifications, onNav, navigate }) {
    const assignedRole = workspace?.assignedRole;
    const roleTitle = workspace?.profile?.display_title || assignedRole?.default_title || 'Staff member';
    const ownershipSummary = workspace?.profile?.ownership_summary || assignedRole?.ownership_summary || assignedRole?.team_role_ownership_summary;
    const tasks = workspace?.tasks || [];
    const reports = workspace?.reports || [];
    const rules = workspace?.decisionRules || [];
    const roster = workspace?.roster || [];
    const moneyRequests = workspace?.moneyRequests || [];

    const urgentTasks = tasks.filter((task) => ['urgent', 'high'].includes(task.priority) && task.status !== 'completed');
    const blockedTasks = tasks.filter((task) => task.status === 'blocked');
    const overdueTasks = tasks.filter((task) => task.due_date && task.status !== 'completed' && new Date(task.due_date) < new Date(new Date().toDateString()));
    const reviewedReports = reports.filter((report) => report.status === 'reviewed').length;
    const pendingReports = reports.length - reviewedReports;
    const pendingMoney = moneyRequests.filter((item) => item.status === 'pending').length;
    const approvedMoney = moneyRequests.filter((item) => item.status === 'approved').length;
    const nextTasks = [...tasks]
        .filter((task) => task.status !== 'completed')
        .sort((a, b) => {
            if (!a.due_date && !b.due_date) return 0;
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return new Date(a.due_date) - new Date(b.due_date);
        })
        .slice(0, 4);

    return (
        <div className="space-y-6">
            <div
                className="rounded-[28px] p-6 sm:p-8 relative overflow-hidden"
                style={{
                    background: 'radial-gradient(circle at top left, rgba(14,165,233,0.25), transparent 28%), radial-gradient(circle at top right, rgba(244,114,182,0.18), transparent 26%), linear-gradient(135deg, #111827 0%, #172033 45%, #0f172a 100%)',
                    border: '1px solid rgba(56,189,248,0.18)'
                }}
            >
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
                <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {assignedRole?.code && <Badge>{assignedRole.code}</Badge>}
                            <Badge tone="slate">{roleTitle}</Badge>
                            <Badge tone="amber">{workspace.summary.activeTasks} active tasks</Badge>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                            Staff Dashboard
                        </h2>
                        <p className="text-base text-slate-300 font-medium mt-3 max-w-2xl">
                            {ownershipSummary || `${user.fullName} is set up for staff operations. Use this dashboard to run tasks, reports, and decision flow without context switching.`}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-5">
                            <button onClick={() => onNav('team')} className="px-5 py-3 rounded-2xl bg-cyan-500 text-slate-950 text-sm font-black hover:bg-cyan-400 transition-colors">
                                Open Team Workspace
                            </button>
                            <button onClick={() => navigate('/calendar')} className="px-5 py-3 rounded-2xl text-sm font-bold text-white hover:bg-white/5 transition-colors" style={{ border: '1px solid rgba(148,163,184,0.3)' }}>
                                View Calendar
                            </button>
                            <button onClick={() => onNav('notifications')} className="px-5 py-3 rounded-2xl text-sm font-bold text-white hover:bg-white/5 transition-colors" style={{ border: '1px solid rgba(148,163,184,0.3)' }}>
                                Notifications {unreadNotifications > 0 ? `(${unreadNotifications})` : ''}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 min-w-[280px]">
                        {[
                            { label: 'Urgent Queue', value: urgentTasks.length, tone: 'text-pink-400' },
                            { label: 'Blocked Tasks', value: blockedTasks.length, tone: 'text-amber-400' },
                            { label: 'Overdue', value: overdueTasks.length, tone: 'text-red-400' },
                            { label: 'Roster Size', value: roster.length, tone: 'text-cyan-400' }
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.14)' }}>
                                <div className={`text-2xl font-bold ${item.tone}`}>{item.value}</div>
                                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-bold mt-2">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Assigned', value: workspace.summary.assignedTasks, tone: 'text-blue-400', sub: 'tasks in your lane' },
                    { label: 'Completed', value: workspace.summary.completedTasks, tone: 'text-emerald-400', sub: 'already closed' },
                    { label: 'Pending Reports', value: pendingReports, tone: 'text-amber-400', sub: 'awaiting review' },
                    { label: 'Reviewed Reports', value: reviewedReports, tone: 'text-pink-400', sub: 'signed off by admin' },
                    { label: 'Pending Money', value: pendingMoney, tone: 'text-cyan-400', sub: 'awaiting admin action' },
                    { label: 'Approved Money', value: approvedMoney, tone: 'text-lime-400', sub: 'ready for payout' }
                ].map((item) => (
                    <div key={item.label} className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <div className={`text-3xl font-bold ${item.tone}`}>{item.value}</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.22em] mt-2">{item.label}</div>
                        <div className="text-sm text-gray-400 mt-2">{item.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr,0.9fr] gap-6">
                <Section
                    title="Focus Queue"
                    subtitle="The tasks that need your attention first."
                    action={<button onClick={() => onNav('team')} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Manage all</button>}
                >
                    <div className="space-y-4">
                        {nextTasks.length === 0 && (
                            <div className="rounded-2xl p-8 text-center text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                No active tasks at the moment.
                            </div>
                        )}
                        {nextTasks.map((task) => (
                            <div key={task.id} className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-base font-bold text-white">{task.title}</h4>
                                            <Badge tone={task.priority === 'urgent' ? 'pink' : task.priority === 'high' ? 'amber' : 'slate'}>
                                                {task.priority}
                                            </Badge>
                                            <Badge tone={task.status === 'blocked' ? 'amber' : task.status === 'completed' ? 'emerald' : 'blue'}>
                                                {task.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        {task.description && (
                                            <p className="text-sm text-gray-400 mt-3 leading-relaxed whitespace-pre-wrap">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-semibold whitespace-nowrap">
                                        {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section
                    title="Command Chain"
                    subtitle="Use the operating rules below to avoid delivery confusion."
                    action={<button onClick={() => onNav('team')} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Open team guide</button>}
                >
                    <div className="space-y-3">
                        {rules.slice(0, 4).map((rule) => (
                            <div key={rule.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                <div className="text-sm font-bold text-white">{rule.question}</div>
                                <p className="text-sm text-gray-400 mt-2 leading-relaxed">{rule.answer}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[0.95fr,1.05fr] gap-6">
                <Section
                    title="Your Role Lane"
                    subtitle="What you own by default in the Lanari operating model."
                    action={assignedRole?.code ? <Badge>{assignedRole.code}</Badge> : null}
                >
                    <div className="flex flex-wrap gap-2">
                        {(assignedRole?.responsibilities || []).length > 0 ? (
                            assignedRole.responsibilities.map((item) => (
                                <Badge key={item.id} tone="slate">{item.responsibility}</Badge>
                            ))
                        ) : (
                            <div className="rounded-2xl p-4 text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                This staff profile does not have responsibilities assigned yet.
                            </div>
                        )}
                    </div>
                </Section>

            <Section
                title="Reporting Pulse"
                subtitle="Your latest updates and whether they have been reviewed."
                action={<button onClick={() => onNav('team')} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Write report</button>}
                >
                    <div className="space-y-3">
                        {reports.length === 0 && (
                            <div className="rounded-2xl p-4 text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                No reports submitted yet.
                            </div>
                        )}
                        {reports.slice(0, 3).map((report) => (
                            <div key={report.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-sm font-bold text-white">{report.title}</div>
                                    <Badge tone={report.status === 'reviewed' ? 'emerald' : 'amber'}>{report.status}</Badge>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {new Date(report.report_date).toLocaleDateString()}{report.task_title ? ` · ${report.task_title}` : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            <Section
                title="Money Flow"
                subtitle="Track your funding requests and any direct offers made by admin."
                action={<button onClick={() => onNav('team')} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Request money</button>}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {moneyRequests.length === 0 && (
                        <div className="rounded-2xl p-4 text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                            No money requests or offers yet.
                        </div>
                    )}
                    {moneyRequests.slice(0, 4).map((item) => (
                        <div key={item.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="text-sm font-bold text-white">{item.title}</div>
                                <Badge tone={item.status === 'paid' ? 'emerald' : item.status === 'rejected' ? 'pink' : item.status === 'approved' ? 'blue' : 'amber'}>
                                    {item.status}
                                </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {Number(item.amount).toFixed(2)} {item.currency} · {item.source === 'admin_offer' ? 'admin offer' : 'staff request'}
                            </div>
                            {item.payment_provider && (
                                <div className="text-xs text-cyan-300 mt-2">
                                    {item.payment_provider}{item.payment_reference ? ` · ${item.payment_reference}` : ''}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                title="Active Team Map"
                subtitle="Who is currently in the system and which ownership seat they are covering."
                action={<button onClick={() => onNav('profile')} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Profile</button>}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {roster.map((member) => (
                        <div key={member.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-white truncate">{member.full_name}</div>
                                    <div className="text-xs text-gray-500 truncate mt-1">{member.email}</div>
                                </div>
                                {member.team_role_code && <Badge>{member.team_role_code}</Badge>}
                            </div>
                            <div className="text-sm text-gray-400 mt-3">
                                {member.display_title || member.team_role_name || member.role}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                title="Staff Alerts"
                subtitle="Recent notifications that affect your day-to-day work."
                action={<button onClick={() => onNav('notifications')} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">View all</button>}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {notifications.length === 0 && (
                        <div className="rounded-2xl p-6 text-sm text-gray-500" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                            No notifications yet.
                        </div>
                    )}
                    {notifications.slice(0, 4).map((notif) => (
                        <div key={notif.id} className="rounded-2xl p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${notif.is_read ? 'bg-gray-600' : 'bg-cyan-400'}`} />
                                <div className="text-sm font-bold text-white">{notif.title}</div>
                            </div>
                            <p className="text-sm text-gray-400 mt-3 leading-relaxed">{notif.description}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
