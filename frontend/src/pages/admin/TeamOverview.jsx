import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTeamData from './useTeamData';

const quickLinks = [
    { label: 'Members', path: '/admin/team/members', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', accent: 'from-blue-600 to-cyan-500' },
    { label: 'Tasks', path: '/admin/team/tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', accent: 'from-emerald-600 to-teal-500' },
    { label: 'Finances', path: '/admin/team/finances', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'from-cyan-600 to-blue-500' },
    { label: 'Roles', path: '/admin/team/roles', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', accent: 'from-purple-600 to-pink-500' },
    { label: 'Rules', path: '/admin/team/rules', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'from-orange-600 to-amber-500' },
    { label: 'Reports', path: '/admin/team/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', accent: 'from-rose-600 to-pink-500' }
];

export default function TeamOverview() {
    const { loading, error, summary } = useTeamData();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Team Overview</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    High-level view of your team's activity and quick access to all management areas.
                </p>
                {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
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

            <div>
                <h2 className="text-lg font-bold text-white mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {quickLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className="group rounded-2xl p-6 text-left transition-all hover:scale-[1.02]"
                            style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${link.accent} flex items-center justify-center mb-4`}>
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{link.label}</h3>
                            <p className="text-sm text-gray-500 mt-1">Manage team {link.label.toLowerCase()}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
