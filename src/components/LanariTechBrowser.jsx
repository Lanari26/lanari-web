import React, { useState, useEffect } from 'react';

export default function LanariTechBrowser() {
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
        { name: 'Siri', icon: '🎯', color: 'from-blue-500 to-cyan-400', url: 'siri.lanari.rw' },
        { name: 'Rise', icon: '📈', color: 'from-purple-500 to-pink-400', url: 'rise.lanari.rw' },
        { name: 'Academy', icon: '🎓', color: 'from-emerald-500 to-teal-400', url: 'academy.lanari.rw' },
        { name: 'AI Solutions', icon: '🤖', color: 'from-orange-500 to-red-400', url: 'ai.lanari.rw' },
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
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
                        L
                    </div>
                    <span className="text-lg font-bold tracking-tight" style={{ color: '#ffffff' }}>Lanari Tech</span>
                </div>

                {/* Central Scrolling Ticker */}
                <div className="flex-1 max-w-3xl mx-8 overflow-hidden relative mask-linear-fade">
                    {/* Gradient Masks for fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[rgba(21,24,33,1)] to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[rgba(21,24,33,1)] to-transparent pointer-events-none" />

                    <div className="flex whitespace-nowrap animate-scroll hover:[animation-play-state:paused] cursor-default">
                        {/* Duplicated list for seamless infinite scroll */}
                        {[...new Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 mx-4">
                                {["Smart Automation", "Cyber Security", "Cloud DevOps", "System Integration", "Future Innovation", "AI Solutions", "Data Analytics", "Digital Transformation"].map((text, j) => (
                                    <span
                                        key={j}
                                        className="text-sm font-semibold text-gray-400 hover:text-blue-400 transition-colors duration-300"
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
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white relative group">
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

                    <button className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20 ring-2 ring-transparent hover:ring-purple-400/50 transition-all scale-100 hover:scale-105">
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
                            <a href="#" className="text-base font-semibold text-blue-400 hover:text-blue-300 hover:underline">More from Lanari →</a>
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
                <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="text-[90px] font-bold" style={{ color: '#ffffff' }}>L</span>
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl" />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50" />
                            </div>
                            <span className="text-[90px] font-bold" style={{ color: '#ffffff' }}>ANARI</span>
                        </div>
                        <div className="text-center">
                            <span className="text-xl font-semibold" style={{ color: '#e5e7eb' }}>Building the Future from Rwanda 🇷🇼</span>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="w-full max-w-2xl mb-8">
                        <div className="rounded-full px-6 py-5 flex items-center gap-4 shadow-2xl transition-all hover:shadow-3xl" style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}>
                            <svg className="w-6 h-6" style={{ color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search our platforms or explore AI solutions..."
                                className="flex-1 bg-transparent text-base font-medium outline-none placeholder-gray-400"
                                style={{ color: '#ffffff' }}
                            />
                            <button className="p-2 rounded-full transition-colors hover:bg-gray-700">
                                <svg className="w-6 h-6" style={{ color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
                            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-base font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                                AI Mode
                            </button>
                        </div>

                        {/* Search Suggestions */}
                        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                            {['Siri Platform', 'Rise Solutions', 'Learn Coding', 'AI for Business'].map((term, i) => (
                                <button
                                    key={i}
                                    className="px-5 py-2.5 rounded-full text-base font-semibold transition-all hover:bg-gray-700"
                                    style={{ backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #4b5563' }}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Projects - Featured Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mb-16">
                        {[
                            {
                                icon: '🎯',
                                title: 'Siri',
                                desc: 'Smart platform solution',
                                color: 'from-blue-500 to-cyan-400',
                                url: 'siri.lanari.rw',
                                highlight: true
                            },
                            {
                                icon: '📈',
                                title: 'Rise',
                                desc: 'Growth-focused platform',
                                color: 'from-purple-500 to-pink-400',
                                url: 'rise.lanari.rw',
                                highlight: true
                            },
                            {
                                icon: '🎓',
                                title: 'Coding Academy',
                                desc: 'Learn tech skills',
                                color: 'from-emerald-500 to-teal-400',
                                url: 'academy.lanari.rw',
                                highlight: true
                            },
                            {
                                icon: '🤖',
                                title: 'AI Solutions',
                                desc: 'Transform your business',
                                color: 'from-orange-500 to-red-400',
                                url: 'ai.lanari.rw',
                                highlight: true
                            }
                        ].map((card, i) => (
                            <div
                                key={i}
                                className="group p-8 rounded-3xl transition-all cursor-pointer hover:scale-105 hover:bg-gray-800"
                                style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                            >
                                <div className={`text-5xl mb-5 group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3" style={{ color: '#ffffff' }}>{card.title}</h3>
                                <p className="text-sm mb-4 font-medium" style={{ color: '#d1d5db' }}>{card.desc}</p>
                                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#9ca3af' }}>
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
                </section>

                {/* Detailed Features Section */}
                <section className="py-32 px-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <div className="inline-block px-6 py-3 rounded-full font-bold mb-8 text-base" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
                                OUR ECOSYSTEM
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: '#ffffff' }}>
                                Empowering Rwanda's Digital Future
                            </h2>
                            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#d1d5db' }}>
                                Four powerful platforms designed to transform education, business, and innovation across Africa
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            {[
                                {
                                    icon: '🎯',
                                    title: 'Siri Platform',
                                    desc: 'Our flagship smart platform delivering cutting-edge solutions for modern challenges. Built with scalability and innovation at its core.',
                                    features: ['Smart Automation', 'Real-time Analytics', 'Scalable Infrastructure', 'Secure by Design'],
                                    color: 'from-blue-500 to-cyan-400'
                                },
                                {
                                    icon: '📈',
                                    title: 'Rise Solutions',
                                    desc: 'Empowering businesses and individuals to reach new heights. A comprehensive platform focused on growth and success.',
                                    features: ['Growth Tools', 'Business Insights', 'Performance Tracking', 'Strategic Planning'],
                                    color: 'from-purple-500 to-pink-400'
                                },
                                {
                                    icon: '🎓',
                                    title: 'Lanari Coding Academy',
                                    desc: 'Training the next generation of African tech talent. Industry-relevant curriculum with hands-on project experience.',
                                    features: ['Expert Instructors', 'Job-Ready Skills', 'Real Projects', 'Career Support'],
                                    color: 'from-emerald-500 to-teal-400'
                                },
                                {
                                    icon: '🤖',
                                    title: 'AI-Powered Business Products',
                                    desc: 'Transform your business with artificial intelligence. Custom AI solutions tailored to African market needs.',
                                    features: ['Custom AI Models', 'Automation Tools', 'Data Analytics', 'Integration Support'],
                                    color: 'from-orange-500 to-red-400'
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group p-8 rounded-3xl transition-all hover:scale-105"
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
                                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                                    Explore Our Projects
                                </button>
                                <button className="px-8 py-4 rounded-full text-lg font-bold transition-all hover:bg-gray-800" style={{ backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #4b5563' }}>
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 px-6" style={{ borderTop: '1px solid #4b5563', backgroundColor: '#151821' }}>
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-12">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <span className="text-xl font-bold">L</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg" style={{ color: '#ffffff' }}>LANARI TECH</h3>
                                        <p className="text-sm font-medium" style={{ color: '#d1d5db' }}>Innovation from Rwanda</p>
                                    </div>
                                </div>
                                <p className="text-base max-w-md" style={{ color: '#9ca3af' }}>
                                    Building the future of technology in Africa through education, innovation, and AI-powered solutions.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-base mb-4" style={{ color: '#ffffff' }}>Our Projects</h4>
                                <nav className="space-y-2">
                                    {['Siri Platform', 'Rise Solutions', 'Coding Academy', 'AI Products'].map((item) => (
                                        <a key={item} href="#" className="block text-base hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div>
                                <h4 className="font-bold text-base mb-4" style={{ color: '#ffffff' }}>Company</h4>
                                <nav className="space-y-2">
                                    {['About', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
                                        <a key={item} href="#" className="block text-base hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #4b5563' }}>
                            <div className="text-base font-semibold" style={{ color: '#9ca3af' }}>
                                © 2024 Lanari Tech Ltd. All rights reserved.
                            </div>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
