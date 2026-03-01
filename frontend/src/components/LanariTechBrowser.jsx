import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LanariTechBrowser() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [searchFocused, setSearchFocused] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showApps, setShowApps] = useState(false);
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

    const urls = [
        "Siri Platform",
        "Rise Solutions",
        "Lanari Academy",
        "AI Products",
        "Cloud Services"
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        const timer = setInterval(() => setTime(new Date()), 1000);
        const urlTimer = setInterval(() => {
            setCurrentUrlIndex(prev => (prev + 1) % urls.length);
        }, 3000);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(timer);
            clearInterval(urlTimer);
        };
    }, []);

    const apps = [
        { name: 'Siri', icon: '🎯', color: 'from-blue-500 to-cyan-400', url: 'https://siri.lanari.rw/' },
        { name: 'Rise', icon: '📈', color: 'from-purple-500 to-pink-400', url: 'https://rise.lanari.rw/' },
        { name: 'Academy', icon: '🎓', color: 'from-emerald-500 to-teal-400', url: 'academy.lanari.rw' },
        { name: 'AI Solutions', icon: '🤖', color: 'from-orange-500 to-red-400', url: 'ai.lanari.rw' },
        { name: 'Partner', icon: '🤝', color: 'from-pink-500 to-rose-400', url: 'partner.lanari.rw' },
        { name: 'Invest', icon: '💎', color: 'from-amber-500 to-yellow-400', url: 'invest.lanari.rw' },
        { name: 'Analytics', icon: '📊', color: 'from-indigo-500 to-purple-400', url: 'analytics.lanari.rw' },
        { name: 'Cloud', icon: '☁️', color: 'from-sky-500 to-blue-400', url: 'cloud.lanari.rw' },
        { name: 'Docs', icon: '📄', color: 'from-yellow-500 to-orange-400', url: 'docs.lanari.rw' },
        { name: 'Mail', icon: '✉️', color: 'from-red-500 to-pink-400', url: 'mail.lanari.rw' },
        { name: 'Calendar', icon: '📅', color: 'from-green-500 to-emerald-400', url: 'calendar.lanari.rw' },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: '#ffffff' }}>
            {/* Browser Chrome */}
            {/* Modern Navigation Bar */}
            <nav
                className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl"
                style={{
                    backgroundColor: 'rgba(21, 24, 33, 0.9)',
                    borderBottom: '1px solid rgba(75, 85, 99, 0.4)'
                }}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-3">
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
                                {["E-Commerce", "Freelancing", "Digital Skills", "Networking", "Online Jobs", "Virtual Stock", "Education", "Innovation"].map((text, j) => (
                                    <span
                                        key={j}
                                        onClick={() => navigate('/coming-soon')}
                                        className="text-sm font-semibold text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                                    >
                                        {text}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/coming-soon')} className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white relative group">
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

                    <button onClick={() => navigate('/coming-soon')} className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20 ring-2 ring-transparent hover:ring-purple-400/50 transition-all scale-100 hover:scale-105">
                        L
                    </button>
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
                                    onClick={() => app.url.startsWith('http') ? window.open(app.url, '_blank') : navigate('/coming-soon')}
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
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/coming-soon'); }} className="text-base font-semibold text-blue-400 hover:text-blue-300 hover:underline">More from Lanari →</a>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="relative">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                            top: `${mousePosition.y / 3}%`,
                            left: `${mousePosition.x / 3}%`,
                            transition: 'all 0.3s ease-out'
                        }}
                    />
                    <div
                        className="absolute w-[500px] h-[500px] rounded-full blur-3xl top-1/4 right-0"
                        style={{
                            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)'
                        }}
                    />
                    <div
                        className="absolute w-[450px] h-[450px] rounded-full blur-3xl bottom-0 left-1/3"
                        style={{
                            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(20, 184, 166, 0.04) 100%)'
                        }}
                    />
                </div>

                {/* Hero Section */}
                <section className="relative h-screen flex flex-col items-center justify-center px-6">
                    <div className="mb-12">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="text-5xl md:text-[90px] font-bold" style={{ color: '#ffffff' }}>L</span>
                            <div className="relative">
                                <img src={logo} alt="Lanari Tech" className="w-12 h-12 md:w-20 md:h-20 rounded-2xl object-cover shadow-2xl shadow-purple-500/20" />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 -z-10" />
                            </div>
                            <span className="text-5xl md:text-[90px] font-bold" style={{ color: '#ffffff' }}>NARI</span>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 animate-bounce">
                        <svg className="w-6 h-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>

                    {/* Search Box */}
                    <div className="w-full max-w-[90%] lg:max-w-[80%]">
                        <div className="rounded-full px-4 py-3 md:px-6 md:py-5 flex items-center gap-2 md:gap-4 shadow-2xl transition-all hover:shadow-3xl" style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}>
                            <svg className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Looking for something you need? Search here…"
                                className="flex-1 bg-transparent text-sm md:text-base lg:text-lg font-medium outline-none placeholder-gray-400 min-w-0"
                                style={{ color: '#ffffff' }}
                            />
                            <button onClick={() => navigate('/coming-soon')} className="p-1.5 md:p-2 rounded-full transition-colors hover:bg-gray-700 flex-shrink-0">
                                <svg className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
                            <button onClick={() => navigate('/coming-soon')} className="px-3 py-1.5 md:px-5 md:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm md:text-base lg:text-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex-shrink-0 whitespace-nowrap">
                                AI Mode
                            </button>
                        </div>

                        {/* Search Suggestions */}
                        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                            {['Siri Platform', 'Rise Solutions', 'Learn Coding', 'AI for Business'].map((term, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate('/coming-soon')}
                                    className="px-5 py-2.5 rounded-full text-sm md:text-base lg:text-lg font-semibold transition-all hover:bg-gray-700"
                                    style={{ backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #4b5563' }}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 animate-bounce">
                        <svg className="w-6 h-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </section>

                {/* Main Projects - Scroll to see these */}
                <section className="px-6 pb-24 relative z-10">
                    <div className="flex flex-col items-center">

                        {/* Main Projects - Featured Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 w-full max-w-[95%] mb-24 lg:mb-32">
                            {[
                                {
                                    icon: '🛍️',
                                    title: 'Siri',
                                    desc: 'Buy & resell without stock',
                                    color: 'from-blue-500 to-cyan-400',
                                    url: 'https://siri.lanari.rw/',
                                    highlight: true
                                },
                                {
                                    icon: '🚀',
                                    title: 'Rise',
                                    desc: 'Freelancing & networking',
                                    color: 'from-purple-500 to-pink-400',
                                    url: 'https://rise.lanari.rw/',
                                    highlight: true
                                },
                                {
                                    icon: '🎓',
                                    title: 'Coding Academy',
                                    desc: 'Practical digital skills',
                                    color: 'from-emerald-500 to-teal-400',
                                    url: 'academy.lanari.rw',
                                    highlight: true
                                },
                                {
                                    icon: '💡',
                                    title: 'Digital Solutions',
                                    desc: 'Innovative tech tools',
                                    color: 'from-orange-500 to-red-400',
                                    url: 'lanari.rw',
                                    highlight: true
                                }
                            ].map((card, i) => (
                                <div
                                    key={i}
                                    onClick={() => card.url.startsWith('http') ? window.open(card.url, '_blank') : navigate('/coming-soon')}
                                    className="group p-8 rounded-3xl transition-all cursor-pointer hover:scale-105 hover:bg-gray-800 flex flex-col items-center text-center lg:items-start lg:text-left"
                                    style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                                >
                                    <div className={`text-5xl lg:text-6xl mb-5 group-hover:scale-110 transition-transform`}>
                                        {card.icon}
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>{card.title}</h3>
                                    <p className="text-sm lg:text-base mb-4 font-medium" style={{ color: '#d1d5db' }}>{card.desc}</p>
                                    <div className="flex items-center gap-2 text-sm font-medium mt-auto" style={{ color: '#9ca3af' }}>
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                                        </svg>
                                        <span>{card.url}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 text-center flex-wrap">
                            <div className="px-8 py-4 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}>
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">4</div>
                                <div className="text-sm font-semibold mt-1" style={{ color: '#d1d5db' }}>Core Projects</div>
                            </div>
                            <div className="px-8 py-4 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}>
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
                                <div className="text-sm font-semibold mt-1" style={{ color: '#d1d5db' }}>Available</div>
                            </div>
                            <div className="px-8 py-4 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}>
                                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">∞</div>
                                <div className="text-sm font-semibold mt-1" style={{ color: '#d1d5db' }}>Possibilities</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Features Section */}
                <section className="py-32 lg:py-48 px-8 relative">
                    <div className="max-w-[90%] mx-auto">
                        <div className="text-center mb-20 lg:mb-32">
                            <div className="inline-block px-6 py-3 rounded-full font-bold mb-8 text-base" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
                                OUR ECOSYSTEM
                            </div>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ color: '#ffffff' }}>
                                Empowering Rwanda's Digital Future
                            </h2>
                            <p className="text-xl lg:text-2xl max-w-4xl mx-auto" style={{ color: '#d1d5db' }}>
                                Four powerful platforms designed to transform education, business, and innovation across Africa
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-24">
                            {[
                                {
                                    icon: '🛍️',
                                    title: 'Siri Market',
                                    desc: 'Become a trader or seller without physical stock. Buy goods online and resell them easily, allowing anyone to shop from wherever they are.',
                                    features: ['Zero Inventory Model', 'Global Marketplace', 'Easy Reselling', 'Secure Payments'],
                                    color: 'from-blue-500 to-cyan-400'
                                },
                                {
                                    icon: '�',
                                    title: 'Rise Network',
                                    desc: 'Enables communication, networking, freelancing, and access to online job opportunities. Connect with professionals and grow your career.',
                                    features: ['Freelance Projects', 'Professional Network', 'Remote Jobs', 'Skill Sharing'],
                                    color: 'from-purple-500 to-pink-400'
                                },
                                {
                                    icon: '🎓',
                                    title: 'Lanari Coding Academy',
                                    desc: 'Provides practical coding and digital skills training to help students and professionals thrive in the fast-evolving tech industry.',
                                    features: ['Practical Training', 'Industry Skills', 'Mentorship', 'Career Growth'],
                                    color: 'from-emerald-500 to-teal-400'
                                },
                                {
                                    icon: '💡',
                                    title: 'Innovative Solutions',
                                    desc: 'We create tools and platforms that make life easier, opportunities accessible, and technology beneficial for everyone.',
                                    features: ['Digital Transformation', 'Custom Platforms', 'Tech Consulting', 'Future Ready'],
                                    color: 'from-orange-500 to-red-400'
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => navigate('/coming-soon')}
                                    className="group p-8 rounded-3xl transition-all hover:scale-105 cursor-pointer"
                                    style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                                >
                                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>{item.title}</h3>
                                    <p className="text-base font-medium mb-6 leading-relaxed" style={{ color: '#d1d5db' }}>{item.desc}</p>
                                    <div className="space-y-3">
                                        {item.features.map((feature, j) => (
                                            <div key={j} className="flex items-center gap-3 text-base font-semibold" style={{ color: '#e5e7eb' }}>
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Call to Action */}
                        <div className="text-center">
                            <div className="inline-flex items-center gap-4">
                                <button onClick={() => navigate('/coming-soon')} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                                    Explore Our Projects
                                </button>
                                <button onClick={() => navigate('/coming-soon')} className="px-8 py-4 rounded-full text-lg font-bold transition-all hover:bg-gray-800" style={{ backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #4b5563' }}>
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-24 px-8 lg:px-16" style={{ borderTop: '1px solid #4b5563', backgroundColor: '#151821' }}>
                    <div className="max-w-[95%] mx-auto">
                        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-24 mb-16">
                            <div className="md:col-span-2 lg:col-span-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <img src={logo} alt="Lanari Tech" className="w-14 h-14 rounded-2xl shadow-lg shadow-purple-500/20" />
                                    <div>
                                        <h3 className="font-bold text-xl lg:text-2xl" style={{ color: '#ffffff' }}>LANARI TECH</h3>
                                        <p className="text-base lg:text-lg font-medium" style={{ color: '#d1d5db' }}>Innovation from Rwanda</p>
                                    </div>
                                </div>
                                <p className="text-lg lg:text-xl leading-relaxed max-w-2xl" style={{ color: '#9ca3af' }}>
                                    Committed to satisfying everyone's needs through innovative digital solutions. We empower people to learn, earn, connect, and grow.
                                </p>
                            </div>

                            <div className="lg:col-span-1"></div> {/* Spacer for better distribution */}

                            <div>
                                <h4 className="font-bold text-lg lg:text-xl mb-6" style={{ color: '#ffffff' }}>Our Projects</h4>
                                <nav className="space-y-4">
                                    {[
                                        { name: 'Siri Platform', url: 'https://siri.lanari.rw/' },
                                        { name: 'Rise Solutions', url: 'https://rise.lanari.rw/' },
                                        { name: 'Coding Academy', url: 'https://lca.lanari.rw/' },
                                        { name: 'AI Products', url: '/coming-soon' },
                                    ].map((item) => (
                                        <a key={item.name} href="#" onClick={(e) => { e.preventDefault(); item.url.startsWith('http') ? window.open(item.url, '_blank') : navigate(item.url); }} className="block text-base lg:text-lg hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                            {item.name}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div>
                                <h4 className="font-bold text-lg lg:text-xl mb-6" style={{ color: '#ffffff' }}>Company</h4>
                                <nav className="space-y-4">
                                    {['About', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
                                        <a key={item} href="#" onClick={(e) => { e.preventDefault(); navigate('/coming-soon'); }} className="block text-base lg:text-lg hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderTop: '1px solid #4b5563' }}>
                            <div className="text-base lg:text-lg font-semibold" style={{ color: '#9ca3af' }}>
                                © 2024 Lanari Tech Ltd. All rights reserved.
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                {/* Instagram */}
                                <a href="https://www.instagram.com/lanari_tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>

                                {/* Facebook */}
                                <a href="https://web.facebook.com/profile.php?id=61578597545608" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>

                                {/* Tiktok */}
                                <a href="https://www.tiktok.com/@lanari_tech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 3.13-1.12 6.19-3.4 8.27-2.15 1.95-5.22 2.74-8.08 1.4-2.85-1.29-4.75-4.06-4.97-7.2-.2-2.92 1.49-5.74 4.09-7.22.48-.28.98-.51 1.5-.68v4.4c-.66.24-1.25.7-1.63 1.28-.48.74-.56 1.72-.21 2.53.53 1.15 1.77 1.74 3.02 1.44 1.17-.26 2.05-1.3 2.05-2.52V.02h3.54z" />
                                    </svg>
                                </a>

                                {/* Whatsapp */}
                                <a href="https://wa.me/250795983610" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </a>

                                {/* Twitter/X */}
                                <a href="https://x.com/Lanari_tech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>

                                {/* Email */}
                                <a href="mailto:lanari.rw@gmail.com" className="hover:text-white transition-colors transform hover:scale-110" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12.713l-11.985-9.713h23.971l-11.986 9.713zm-5.425-1.822l-6.575-5.329v12.501l6.575-7.172zm10.85 0l6.575 7.172v-12.501l-6.575 5.329zm-1.557 1.261l-3.868 3.135-3.868-3.135-8.11 8.848h23.956l-8.11-8.848z" />
                                    </svg>
                                </a>

                                {/* LinkedIn */}
                                <a href="https://www.linkedin.com/company/lanari-tech-ltd/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div >
        </div >
    );
}
