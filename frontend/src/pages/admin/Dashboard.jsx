import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';

const statCards = [
    { key: 'users', label: 'Total Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-blue-500 to-cyan-400', link: '/admin/users' },
    { key: 'messages', label: 'Messages', badge: 'unreadMessages', badgeLabel: 'unread', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'from-emerald-500 to-teal-400', link: '/admin/messages' },
    { key: 'partners', label: 'Partner Requests', badge: 'pendingPartners', badgeLabel: 'pending', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'from-purple-500 to-pink-400', link: '/admin/partners' },
    { key: 'jobs', label: 'Active Jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'from-orange-500 to-red-400', link: '/admin/jobs' },
    { key: 'applications', label: 'Applications', badge: 'newApplications', badgeLabel: 'new', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'from-amber-500 to-yellow-400', link: '/admin/jobs' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/admin/stats'),
            api.get('/admin/analytics').catch(() => ({ data: null }))
        ])
            .then(([statsRes, analyticsRes]) => {
                setStats(statsRes.data);
                setAnalytics(analyticsRes.data);
            })
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

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                <p className="text-sm font-medium text-gray-500">Here's what's happening with Lanari Tech today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {statCards.map(card => (
                    <button
                        key={card.key}
                        onClick={() => navigate(card.link)}
                        className="p-5 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                        style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                                </svg>
                            </div>
                            {card.badge && stats[card.badge] > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                                    {stats[card.badge]} {card.badgeLabel}
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stats[card.key]}</div>
                        <div className="text-xs font-semibold text-gray-500">{card.label}</div>
                    </button>
                ))}
            </div>

            {/* Today's Activity */}
            {analytics?.today && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Today's Activity</h3>
                        <button
                            onClick={() => navigate('/admin/analytics')}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            View Full Analytics →
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { label: 'Page Visits', value: analytics.today.visits || 0, color: 'text-blue-400' },
                            { label: 'Logins', value: analytics.today.logins || 0, color: 'text-emerald-400' },
                            { label: 'Registrations', value: analytics.today.registrations || 0, color: 'text-purple-400' },
                            { label: 'Contact Forms', value: analytics.today.contacts || 0, color: 'text-amber-400' },
                            { label: 'Job Applications', value: analytics.today.applications || 0, color: 'text-orange-400' },
                            { label: 'Unique Visitors', value: analytics.uniqueVisitors || 0, color: 'text-indigo-400' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-xl text-center" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                <div className={`text-xl font-bold ${item.color} mb-1`}>{item.value}</div>
                                <div className="text-[10px] font-semibold text-gray-600">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'View Messages', desc: `${stats.unreadMessages} unread`, path: '/admin/messages', color: 'text-emerald-400' },
                        { label: 'Review Partners', desc: `${stats.pendingPartners} pending`, path: '/admin/partners', color: 'text-purple-400' },
                        { label: 'Manage Jobs', desc: `${stats.jobs} active listings`, path: '/admin/jobs', color: 'text-orange-400' },
                        { label: 'Manage Users', desc: `${stats.users} registered`, path: '/admin/users', color: 'text-blue-400' },
                    ].map((action, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-gray-700/50"
                            style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                        >
                            <div>
                                <div className={`text-sm font-bold ${action.color}`}>{action.label}</div>
                                <div className="text-xs font-medium text-gray-600">{action.desc}</div>
                            </div>
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
