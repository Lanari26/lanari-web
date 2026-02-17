import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Header() {
    const navigate = useNavigate();
    const [showApps, setShowApps] = useState(false);
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored) setUser(JSON.parse(stored));
        } catch {}
    }, []);

    const apps = [
        { name: 'Siri', icon: '🎯', color: 'from-blue-500 to-cyan-400', url: '/siri' },
        { name: 'Rise', icon: '📈', color: 'from-purple-500 to-pink-400', url: '/rise' },
        { name: 'Academy', icon: '🎓', color: 'from-emerald-500 to-teal-400', url: '/academy' },
        { name: 'AI Solutions', icon: '🤖', color: 'from-orange-500 to-red-400', url: '/ai-products' },
        { name: 'Partner', icon: '🤝', color: 'from-pink-500 to-rose-400', url: '/partner' },
        { name: 'Invest', icon: '💎', color: 'from-amber-500 to-yellow-400', url: '/invest' },
        { name: 'Analytics', icon: '📊', color: 'from-indigo-500 to-purple-400', url: '/analytics' },
        { name: 'Cloud', icon: '☁️', color: 'from-sky-500 to-blue-400', url: '/cloud' },
        { name: 'Docs', icon: '📄', color: 'from-yellow-500 to-orange-400', url: '/docs' },
        { name: 'Mail', icon: '✉️', color: 'from-red-500 to-pink-400', url: '/mail' },
        { name: 'Calendar', icon: '📅', color: 'from-green-500 to-emerald-400', url: '/calendar' },
    ];

    return (
        <>
            <nav
                className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl"
                style={{
                    backgroundColor: 'rgba(21, 24, 33, 0.9)',
                    borderBottom: '1px solid rgba(75, 85, 99, 0.4)'
                }}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="Lanari Tech" className="w-10 h-10 rounded-xl shadow-lg shadow-blue-500/20" />
                    <span className="text-lg font-bold tracking-tight" style={{ color: '#ffffff' }}>Lanari Tech</span>
                </div>

                {/* Central Scrolling Ticker */}
                <div className="hidden md:block flex-1 max-w-3xl mx-8 overflow-hidden relative mask-linear-fade">
                    {/* Gradient Masks for fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[rgba(21,24,33,1)] to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[rgba(21,24,33,1)] to-transparent pointer-events-none" />

                    <div className="flex whitespace-nowrap animate-scroll hover:[animation-play-state:paused] cursor-default">
                        {/* Duplicated list for seamless infinite scroll */}
                        {[...new Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 mx-4">
                                {[
                                    { text: "E-Commerce", url: "/siri" },
                                    { text: "Freelancing", url: "/rise" },
                                    { text: "Digital Skills", url: "/academy" },
                                    { text: "Networking", url: "/rise" },
                                    { text: "Online Jobs", url: "/rise" },
                                    { text: "Virtual Stock", url: "/siri" },
                                    { text: "Education", url: "/academy" },
                                    { text: "Innovation", url: "/ai-products" }
                                ].map((item, j) => (
                                    <span
                                        key={j}
                                        onClick={() => navigate(item.url)}
                                        className="text-sm font-semibold text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                                    >
                                        {item.text}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/notifications')} className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white relative group">
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setShowApps(!showApps)}
                        className={`p-2 rounded-full transition-all duration-300 ${showApps ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
                        </svg>
                    </button>

                    {user ? (
                        <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-500/20 ring-2 ring-transparent hover:ring-purple-400/50 transition-all scale-100 hover:scale-105">
                            {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                        </button>
                    ) : (
                        <button onClick={() => navigate('/login')} className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20 ring-2 ring-transparent hover:ring-purple-400/50 transition-all scale-100 hover:scale-105">
                            L
                        </button>
                    )}
                </div>
            </nav>

            {/* Apps Menu Overlay */}
            {showApps && (
                <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20" onClick={() => setShowApps(false)}>
                    <div
                        className="rounded-2xl p-6 shadow-2xl w-[420px]"
                        style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-3 gap-4">
                            {apps.map((app, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(app.url)}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all group hover:bg-gray-700"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg`}>
                                        {app.icon}
                                    </div>
                                    <span className="text-sm font-semibold text-center" style={{ color: '#ffffff' }}>{app.name}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid #4b5563' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/projects'); }} className="text-base font-semibold text-blue-400 hover:text-blue-300 hover:underline">More from Lanari →</a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
