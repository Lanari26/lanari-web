import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const API = import.meta.env.VITE_API_URL;

const sidebarNav = [
    { label: 'Overview', id: 'overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    { label: 'Notifications', id: 'notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { label: 'Applications', id: 'applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Profile', id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Products', id: 'products', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
];

const quickLinks = [
    { name: 'Siri', desc: 'E-Commerce Platform', icon: '🎯', color: 'from-blue-500 to-cyan-400', url: '/siri' },
    { name: 'Rise', desc: 'Freelancing & Jobs', icon: '📈', color: 'from-purple-500 to-pink-400', url: '/rise' },
    { name: 'Academy', desc: 'Learn New Skills', icon: '🎓', color: 'from-emerald-500 to-teal-400', url: '/academy' },
    { name: 'AI Solutions', desc: 'AI-Powered Tools', icon: '🤖', color: 'from-orange-500 to-red-400', url: '/ai-products' },
    { name: 'Cloud', desc: 'Cloud Services', icon: '☁️', color: 'from-sky-500 to-blue-400', url: '/cloud' },
    { name: 'Mail', desc: 'Lanari Mail', icon: '✉️', color: 'from-red-500 to-pink-400', url: '/mail' },
    { name: 'Calendar', desc: 'Schedule & Events', icon: '📅', color: 'from-green-500 to-emerald-400', url: '/calendar' },
    { name: 'Docs', desc: 'Documentation', icon: '📄', color: 'from-yellow-500 to-orange-400', url: '/docs' },
];

export default function UserDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`${API}/auth/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Session expired');
                return res.json();
            })
            .then(res => setData(res.data))
            .catch(err => {
                if (err.message === 'Session expired') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    setError(err.message);
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleNavClick = (id) => {
        setActiveSection(id);
        setMobileOpen(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0e1a' }}>
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0a0e1a' }}>
            <div className="p-8 rounded-2xl text-center max-w-md w-full" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                <p className="text-red-400 font-semibold mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors">
                    Retry
                </button>
            </div>
        </div>
    );

    const { user, notifications, unreadNotifications, applications } = data;
    const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const memberDate = new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0a0e1a' }}>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:relative z-50 flex flex-col h-full transition-all duration-300 flex-shrink-0
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${collapsed ? 'lg:w-[72px]' : 'lg:w-60'}
                    w-60
                `}
                style={{ backgroundColor: '#111827', borderRight: '1px solid #1f2937' }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid #1f2937' }}>
                    <img src={logo} alt="Lanari" className="w-9 h-9 rounded-xl flex-shrink-0 cursor-pointer" onClick={() => navigate('/')} />
                    {!collapsed && <span className="text-sm font-bold text-white truncate">Lanari Dashboard</span>}
                    {/* Mobile close */}
                    <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User mini profile */}
                <div className={`px-3 py-4 ${collapsed ? 'flex justify-center' : ''}`} style={{ borderBottom: '1px solid #1f2937' }}>
                    {collapsed ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xs font-bold text-white">
                            {initials}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-white truncate">{user.fullName}</div>
                                <div className="text-[11px] font-medium text-gray-500 truncate">{user.email}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                    {sidebarNav.map((item) => {
                        const active = activeSection === item.id;
                        const hasBadge = item.id === 'notifications' && unreadNotifications > 0;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                                    ? 'bg-blue-500/15 text-blue-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                title={item.label}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {hasBadge && (
                                            <span className="w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                                {unreadNotifications}
                                            </span>
                                        )}
                                    </>
                                )}
                                {collapsed && hasBadge && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="px-2 pb-4 space-y-1" style={{ borderTop: '1px solid #1f2937' }}>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-white hover:bg-white/5 transition-all mt-3"
                    >
                        <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        {!collapsed && <span>Collapse</span>}
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {!collapsed && <span>Back to Site</span>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0" style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937' }}>
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-white">
                            {sidebarNav.find(i => i.id === activeSection)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-sm font-medium text-gray-400">{user.fullName}</span>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {activeSection === 'overview' && (
                        <OverviewSection
                            user={user}
                            initials={initials}
                            memberDate={memberDate}
                            notifications={notifications}
                            unreadNotifications={unreadNotifications}
                            applications={applications}
                            navigate={navigate}
                            onNav={handleNavClick}
                        />
                    )}
                    {activeSection === 'notifications' && (
                        <NotificationsSection notifications={notifications} navigate={navigate} />
                    )}
                    {activeSection === 'applications' && (
                        <ApplicationsSection applications={applications} navigate={navigate} />
                    )}
                    {activeSection === 'profile' && (
                        <ProfileSection user={user} initials={initials} memberDate={memberDate} />
                    )}
                    {activeSection === 'products' && (
                        <ProductsSection navigate={navigate} />
                    )}
                </main>
            </div>
        </div>
    );
}

/* ─── Section Components ─── */

function OverviewSection({ user, initials, memberDate, notifications, unreadNotifications, applications, navigate, onNav }) {
    return (
        <div className="space-y-6">
            {/* Welcome header */}
            <div className="p-6 sm:p-8 rounded-2xl relative overflow-hidden" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/20">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Welcome back, {user.fullName.split(' ')[0]}</h2>
                        <p className="text-gray-400 text-sm font-medium">{user.email}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                            <span className="text-xs font-medium text-gray-500">Member since {memberDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Notifications', value: notifications.length, sub: `${unreadNotifications} unread`, color: 'from-blue-500 to-cyan-400', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', click: () => onNav('notifications') },
                    { label: 'Applications', value: applications.length, sub: 'job applications', color: 'from-purple-500 to-pink-400', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', click: () => onNav('applications') },
                    { label: 'Account Status', value: 'Active', sub: user.role + ' account', color: 'from-emerald-500 to-teal-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', click: () => onNav('profile') }
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={stat.click}
                        className="p-5 rounded-2xl text-left transition-all hover:scale-[1.02]"
                        style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
                            </div>
                        </div>
                        <div className="mt-3 text-xs font-medium text-gray-600">{stat.sub}</div>
                    </button>
                ))}
            </div>

            {/* Recent Notifications */}
            <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-white">Recent Notifications</h3>
                    <button onClick={() => onNav('notifications')} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                        View All
                    </button>
                </div>
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.slice(0, 3).map((notif) => (
                            <NotificationItem key={notif.id} notif={notif} />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Access */}
            <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickLinks.slice(0, 4).map((app, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(app.url)}
                            className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all hover:scale-[1.03] group"
                            style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                                {app.icon}
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-white">{app.name}</div>
                                <div className="text-[10px] font-medium text-gray-600 hidden sm:block">{app.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function NotificationItem({ notif }) {
    const typeColors = {
        success: 'text-emerald-400 bg-emerald-500/15',
        warning: 'text-amber-400 bg-amber-500/15',
        error: 'text-red-400 bg-red-500/15',
        info: 'text-blue-400 bg-blue-500/15'
    };
    const colorClass = typeColors[notif.type] || typeColors.info;

    return (
        <div
            className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-colors ${notif.is_read ? 'opacity-60' : ''}`}
            style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
        >
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.is_read ? 'bg-gray-600' : 'bg-blue-500'}`} />
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white truncate">{notif.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colorClass}`}>
                        {notif.type}
                    </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{notif.description}</p>
                <span className="text-[10px] text-gray-600 font-medium mt-1 block">
                    {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}

function NotificationsSection({ notifications, navigate }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">{notifications.length} total notifications</p>
                </div>
                <button
                    onClick={() => navigate('/notifications')}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-blue-400 hover:bg-blue-500/10 transition-all self-start"
                    style={{ border: '1px solid rgba(59,130,246,0.2)' }}
                >
                    Manage All
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <p className="text-gray-400 font-bold text-lg mb-1">All caught up</p>
                    <p className="text-gray-600 text-sm">No notifications to show</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <NotificationItem key={notif.id} notif={notif} />
                    ))}
                </div>
            )}
        </div>
    );
}

function ApplicationsSection({ applications, navigate }) {
    const typeColors = {
        'Full-time': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        'Part-time': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        'Internship': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
        'Contract': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-white">Applications</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">{applications.length} job application{applications.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => navigate('/careers')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all self-start"
                >
                    Browse Open Positions
                </button>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 font-bold text-lg mb-1">No applications yet</p>
                    <p className="text-gray-600 text-sm mb-6">Browse open positions and apply to get started.</p>
                    <button
                        onClick={() => navigate('/careers')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all"
                    >
                        View Careers
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="p-5 sm:p-6 rounded-2xl transition-all hover:scale-[1.01]"
                            style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-white mb-1">{app.job_title}</h3>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-700/60 text-gray-300">
                                                {app.department}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${typeColors[app.type] || 'bg-gray-700/60 text-gray-300 border-gray-600'}`}>
                                                {app.type}
                                            </span>
                                            <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {app.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                                        Under Review
                                    </span>
                                    <span className="text-[11px] text-gray-600 font-medium">
                                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            {app.cover_letter && (
                                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Cover Letter</p>
                                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{app.cover_letter}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProfileSection({ user, initials, memberDate }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Your Profile</h2>

            {/* Profile Card */}
            <div className="p-6 sm:p-8 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
                        {initials}
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
                        <p className="text-gray-400 text-sm font-medium">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Full Name', value: user.fullName, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                        { label: 'Email Address', value: user.email, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                        { label: 'Phone Number', value: user.phoneNumber || 'Not provided', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                        { label: 'Member Since', value: memberDate, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: '#111827' }}>
                            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{item.label}</div>
                                <div className="text-sm font-semibold text-gray-300 truncate">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProductsSection({ navigate }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Lanari Products</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Explore the Lanari Tech ecosystem</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {quickLinks.map((app, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(app.url)}
                        className="flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl transition-all hover:scale-[1.03] group"
                        style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    >
                        <div className={`w-14 h-14 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {app.icon}
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-white">{app.name}</div>
                            <div className="text-[10px] font-medium text-gray-600 hidden sm:block">{app.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Explore more */}
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                <p className="text-gray-500 text-sm font-medium mb-4">Explore everything Lanari Tech has to offer</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {[
                        { label: 'Browse Careers', path: '/careers', color: 'text-purple-400' },
                        { label: 'Become a Partner', path: '/partner', color: 'text-emerald-400' },
                        { label: 'Contact Us', path: '/contact', color: 'text-blue-400' },
                        { label: 'View Projects', path: '/projects', color: 'text-orange-400' },
                    ].map((link, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(link.path)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold ${link.color} transition-all hover:bg-gray-800`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
