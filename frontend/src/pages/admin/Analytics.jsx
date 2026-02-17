import React, { useState, useEffect } from 'react';
import { api } from './api';

const eventLabels = {
    page_visit: 'Page Visit',
    login: 'Login',
    register: 'Registration',
    contact_submit: 'Contact Form',
    job_apply: 'Job Application',
    partner_request: 'Partner Request'
};

const eventColors = {
    page_visit: 'text-blue-400',
    login: 'text-emerald-400',
    register: 'text-purple-400',
    contact_submit: 'text-amber-400',
    job_apply: 'text-orange-400',
    partner_request: 'text-pink-400'
};

const eventBg = {
    page_visit: 'bg-blue-500/15',
    login: 'bg-emerald-500/15',
    register: 'bg-purple-500/15',
    contact_submit: 'bg-amber-500/15',
    job_apply: 'bg-orange-500/15',
    partner_request: 'bg-pink-500/15'
};

function StatCard({ label, value, todayValue, color, icon }) {
    return (
        <div className="p-5 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                </div>
                {todayValue > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                        +{todayValue} today
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value || 0}</div>
            <div className="text-xs font-semibold text-gray-500">{label}</div>
        </div>
    );
}

function BarChart({ data, label }) {
    if (!data || data.length === 0) return <p className="text-gray-500 text-sm">No data yet</p>;
    const maxVal = Math.max(...data.map(d => Number(d.visits) || 0), 1);
    return (
        <div className="space-y-1.5">
            <div className="text-xs font-semibold text-gray-500 mb-3">{label}</div>
            {data.map((d, i) => {
                const visits = Number(d.visits) || 0;
                const logins = Number(d.logins) || 0;
                const regs = Number(d.registrations) || 0;
                const dateStr = new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-[11px] text-gray-500 w-14 text-right font-mono">{dateStr}</span>
                        <div className="flex-1 flex gap-1 items-center">
                            <div className="h-5 rounded bg-blue-500/60 transition-all" style={{ width: `${(visits / maxVal) * 100}%`, minWidth: visits > 0 ? '4px' : '0' }} title={`${visits} visits`} />
                            <div className="h-5 rounded bg-emerald-500/60 transition-all" style={{ width: `${(logins / maxVal) * 100}%`, minWidth: logins > 0 ? '4px' : '0' }} title={`${logins} logins`} />
                            <div className="h-5 rounded bg-purple-500/60 transition-all" style={{ width: `${(regs / maxVal) * 100}%`, minWidth: regs > 0 ? '4px' : '0' }} title={`${regs} registrations`} />
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono w-8 text-right">{visits}</span>
                    </div>
                );
            })}
            <div className="flex gap-4 mt-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500/60" />Visits</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/60" />Logins</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-500/60" />Registrations</span>
            </div>
        </div>
    );
}

function formatTime(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('overview');

    useEffect(() => {
        api.get('/admin/analytics')
            .then(res => setData(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <p className="text-red-400 font-semibold">{error}</p>
        </div>
    );

    const { overview, uniqueVisitors, today, week, month, dailyActivity, topPages, recent } = data;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Daily Activity' },
        { id: 'pages', label: 'Top Pages' },
        { id: 'feed', label: 'Live Feed' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Analytics</h2>
                <p className="text-sm font-medium text-gray-500">Monitor all website activity and user engagement.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: '#111827' }}>
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === t.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {tab === 'overview' && (
                <div className="space-y-6">
                    {/* Main Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <StatCard label="Total Visits" value={overview.totalVisits} todayValue={today.visits} color="from-blue-500 to-cyan-400" icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <StatCard label="Unique Visitors" value={uniqueVisitors} todayValue={0} color="from-indigo-500 to-blue-400" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        <StatCard label="Total Logins" value={overview.totalLogins} todayValue={today.logins} color="from-emerald-500 to-teal-400" icon="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        <StatCard label="Registrations" value={overview.totalRegistrations} todayValue={today.registrations} color="from-purple-500 to-pink-400" icon="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        <StatCard label="Contact Forms" value={overview.totalContacts} todayValue={today.contacts} color="from-amber-500 to-yellow-400" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        <StatCard label="Job Applications" value={overview.totalApplications} todayValue={today.applications} color="from-orange-500 to-red-400" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </div>

                    {/* Period Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Today', data: today },
                            { label: 'This Week', data: week },
                            { label: 'This Month', data: month }
                        ].map(period => (
                            <div key={period.label} className="p-5 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                                <h3 className="text-sm font-bold text-gray-400 mb-4">{period.label}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Visits</span>
                                        <span className="text-sm font-bold text-blue-400">{period.data.visits || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Logins</span>
                                        <span className="text-sm font-bold text-emerald-400">{period.data.logins || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">Registrations</span>
                                        <span className="text-sm font-bold text-purple-400">{period.data.registrations || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Daily Activity Tab */}
            {tab === 'activity' && (
                <div className="p-6 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <BarChart data={dailyActivity} label="Last 14 Days Activity" />
                </div>
            )}

            {/* Top Pages Tab */}
            {tab === 'pages' && (
                <div className="p-6 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <h3 className="text-sm font-bold text-gray-400 mb-4">Most Visited Pages</h3>
                    {topPages && topPages.length > 0 ? (
                        <div className="space-y-2">
                            {topPages.map((p, i) => {
                                const maxVisits = topPages[0].visits;
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 w-6 text-right font-bold">#{i + 1}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-200">{p.page || '/'}</span>
                                                <span className="text-xs font-bold text-blue-400">{p.visits} visits</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-gray-700">
                                                <div className="h-full rounded-full bg-blue-500/60" style={{ width: `${(p.visits / maxVisits) * 100}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No page visits recorded yet.</p>
                    )}
                </div>
            )}

            {/* Live Feed Tab */}
            {tab === 'feed' && (
                <div className="p-6 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <h3 className="text-sm font-bold text-gray-400 mb-4">Recent Activity</h3>
                    {recent && recent.length > 0 ? (
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                            {recent.map((entry, i) => {
                                const meta = typeof entry.metadata === 'string' ? JSON.parse(entry.metadata) : entry.metadata;
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#111827' }}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${eventBg[entry.event_type] || 'bg-gray-500/15'}`}>
                                            <span className={`text-xs font-bold ${eventColors[entry.event_type] || 'text-gray-400'}`}>
                                                {(eventLabels[entry.event_type] || entry.event_type).charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold ${eventColors[entry.event_type] || 'text-gray-400'}`}>
                                                    {eventLabels[entry.event_type] || entry.event_type}
                                                </span>
                                                {entry.full_name && (
                                                    <span className="text-[11px] text-gray-500">by {entry.full_name}</span>
                                                )}
                                            </div>
                                            {meta?.page && <span className="text-[11px] text-gray-600 truncate block">{meta.page}</span>}
                                            {meta?.email && <span className="text-[11px] text-gray-600 truncate block">{meta.email}</span>}
                                        </div>
                                        <span className="text-[11px] text-gray-600 whitespace-nowrap">{formatTime(entry.created_at)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No activity recorded yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
