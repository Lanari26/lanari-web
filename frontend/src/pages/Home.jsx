import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, inView];
}

const CARDS = [
    { icon: '🛍️', title: 'Siri', desc: 'Buy & resell anywhere even without stock', color: 'from-blue-500 to-cyan-400', url: '/siri' },
    { icon: '🚀', title: 'Rise', desc: 'Freelancing, Jobs & Internships', color: 'from-purple-500 to-pink-400', url: '/rise' },
    { icon: '🎓', title: 'Coding Academy', desc: 'Practical digital skills', color: 'from-emerald-500 to-teal-400', url: '/academy' },
    { icon: '💡', title: 'Digital Solutions', desc: 'Innovative tech tools', color: 'from-orange-500 to-red-400', url: '/ai-products' },
];

const FEATURES = [
    { icon: '🛍️', title: 'Siri Market', desc: 'Become a trader or seller anywhere even without physical stock. Buy goods online and resell them easily, allowing anyone to shop from wherever they are.', features: ['Zero Inventory Model', 'Global Marketplace', 'Easy Reselling', 'Secure Payments'], color: 'from-blue-500 to-cyan-400', url: '/siri' },
    { icon: '🌐', title: 'Rise Network', desc: 'Enables communication, networking, freelancing, and access to online job and internship opportunities. Connect with professionals and grow your career.', features: ['Freelance Projects', 'Professional Network', 'Remote Jobs', 'Skill Sharing'], color: 'from-purple-500 to-pink-400', url: '/rise' },
    { icon: '🎓', title: 'Lanari Coding Academy', desc: 'Provides practical coding and digital skills training to help students and professionals thrive in the fast-evolving tech industry.', features: ['Practical Training', 'Industry Skills', 'Mentorship', 'Career Growth'], color: 'from-emerald-500 to-teal-400', url: '/academy' },
    { icon: '💡', title: 'Innovative Solutions', desc: 'We create tools and platforms that make life easier, opportunities accessible, and technology beneficial for everyone.', features: ['Digital Transformation', 'Custom Platforms', 'Tech Consulting', 'Future Ready'], color: 'from-orange-500 to-red-400', url: '/ai-products' },
];

const SUGGESTIONS = [
    { label: 'Siri Platform', path: '/siri' },
    { label: 'Rise Platform', path: '/rise' },
    { label: 'Learn Coding', path: '/academy' },
    { label: 'AI for Business', path: '/ai-products' },
];

const STATS = [
    { value: '4', label: 'Core Projects', gradient: 'from-blue-400 to-purple-400' },
    { value: '24/7', label: 'Available', gradient: 'from-purple-400 to-pink-400' },
    { value: '∞', label: 'Possibilities', gradient: 'from-emerald-400 to-teal-400' },
];

export default function Home() {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [searchQuery, setSearchQuery] = useState('');

    const [cardsRef, cardsInView] = useInView(0.1);
    const [statsRef, statsInView] = useInView(0.2);
    const [featuresTitleRef, featuresTitleInView] = useInView(0.2);
    const [featuresGridRef, featuresGridInView] = useInView(0.05);
    const [ctaRef, ctaInView] = useInView(0.3);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 80);
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

    return (
        <div className="relative">

            {/* ── Animated Background ── */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Mouse-tracking orb */}
                <div
                    className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, rgba(6,182,212,0.06) 100%)',
                        top: `${mousePosition.y / 3}%`,
                        left: `${mousePosition.x / 3}%`,
                        transition: 'top 1s ease-out, left 1s ease-out',
                    }}
                />
                {/* Static ambient orbs */}
                <div
                    className="absolute w-[500px] h-[500px] rounded-full blur-3xl top-1/4 right-0 animate-float"
                    style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.05) 100%)' }}
                />
                <div
                    className="absolute w-[450px] h-[450px] rounded-full blur-3xl bottom-0 left-1/3 animate-float-slow"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(20,184,166,0.04) 100%)' }}
                />
                {/* Subtle grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* ── Hero ── */}
            <section className="relative h-screen flex flex-col items-center justify-center px-6">

                {/* Brand */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span
                            className="text-5xl md:text-[90px] font-bold"
                            style={{
                                color: '#ffffff',
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'translateX(0)' : 'translateX(-40px)',
                                transition: `opacity 0.9s ${ease} 0.05s, transform 0.9s ${ease} 0.05s`,
                            }}
                        >L</span>

                        <div
                            className="relative"
                            style={{
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.4) translateY(20px)',
                                transition: `opacity 0.9s ${ease} 0.2s, transform 0.9s ${ease} 0.2s`,
                            }}
                        >
                            <img
                                src={logo}
                                alt="Lanari Tech"
                                className="w-12 h-12 md:w-20 md:h-20 rounded-2xl object-cover shadow-2xl shadow-purple-500/20"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl -z-10 animate-pulse-glow" />
                        </div>

                        <span
                            className="text-5xl md:text-[90px] font-bold"
                            style={{
                                color: '#ffffff',
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'translateX(0)' : 'translateX(40px)',
                                transition: `opacity 0.9s ${ease} 0.05s, transform 0.9s ${ease} 0.05s`,
                            }}
                        >NARI</span>
                    </div>
                </div>

                {/* Search box */}
                <div
                    className="w-full max-w-[90%] lg:max-w-[80%]"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(28px)',
                        transition: `opacity 0.8s ${ease} 0.38s, transform 0.8s ${ease} 0.38s`,
                    }}
                >
                    <form
                        onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`); }}
                        className="rounded-full px-4 py-3 md:px-6 md:py-5 flex items-center gap-2 md:gap-4 shadow-2xl transition-shadow hover:shadow-purple-500/10"
                        style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" style={{ color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Looking for something you need? Search here…"
                            className="flex-1 bg-transparent text-sm md:text-base lg:text-lg font-medium outline-none placeholder-gray-400 min-w-0"
                            style={{ color: '#ffffff' }}
                        />
                        <button
                            type="button"
                            onClick={() => navigate('/coming-soon')}
                            className="p-1.5 md:p-2 rounded-full transition-colors hover:bg-gray-700 flex-shrink-0"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/ai${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery)}` : ''}`)}
                            className="px-3 py-1.5 md:px-5 md:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm md:text-base lg:text-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex-shrink-0 whitespace-nowrap hover:scale-105"
                        >
                            AI Mode
                        </button>
                    </form>

                    {/* Search suggestions */}
                    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                        {SUGGESTIONS.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(item.path)}
                                className="px-5 py-2.5 rounded-full text-sm md:text-base lg:text-lg font-semibold transition-all hover:bg-gray-700 hover:scale-105"
                                style={{
                                    backgroundColor: '#1f2937',
                                    color: '#ffffff',
                                    border: '1px solid #4b5563',
                                    opacity: mounted ? 1 : 0,
                                    transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                                    transition: `opacity 0.6s ${ease} ${0.52 + i * 0.08}s, transform 0.6s ${ease} ${0.52 + i * 0.08}s`,
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    className="absolute bottom-10 animate-bounce"
                    style={{ opacity: mounted ? 0.5 : 0, transition: 'opacity 1s ease 1.3s' }}
                >
                    <svg className="w-6 h-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* ── Project Cards ── */}
            <section className="px-6 pb-24 relative z-10">
                <div className="flex flex-col items-center">

                    <div
                        ref={cardsRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 w-full max-w-[95%] mb-24 lg:mb-32"
                    >
                        {CARDS.map((card, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(card.url)}
                                className="group p-8 rounded-3xl cursor-pointer flex flex-col items-center text-center lg:items-start lg:text-left hover:bg-gray-800"
                                style={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #4b5563',
                                    opacity: cardsInView ? 1 : 0,
                                    transform: cardsInView ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.96)',
                                    transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ${ease} ${i * 0.1}s`,
                                }}
                            >
                                <div className="text-5xl lg:text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl lg:text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>{card.title}</h3>
                                <p className="text-sm lg:text-base mb-4 font-medium" style={{ color: '#d1d5db' }}>{card.desc}</p>
                                <div className="flex items-center gap-2 text-sm font-medium mt-auto group-hover:gap-3 transition-all duration-200" style={{ color: '#9ca3af' }}>
                                    <span>Learn more</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div ref={statsRef} className="flex items-center justify-center gap-8 text-center flex-wrap">
                        {STATS.map((stat, i) => (
                            <div
                                key={i}
                                className="px-8 py-4 rounded-2xl"
                                style={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #4b5563',
                                    opacity: statsInView ? 1 : 0,
                                    transform: statsInView ? 'scale(1) translateY(0)' : 'scale(0.75) translateY(20px)',
                                    transition: `all 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.14}s`,
                                }}
                            >
                                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm font-semibold mt-1" style={{ color: '#d1d5db' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Ecosystem Section ── */}
            <section className="py-32 lg:py-48 px-8 relative">
                <div className="max-w-[90%] mx-auto">

                    {/* Section title */}
                    <div
                        ref={featuresTitleRef}
                        className="text-center mb-20 lg:mb-32"
                        style={{
                            opacity: featuresTitleInView ? 1 : 0,
                            transform: featuresTitleInView ? 'translateY(0)' : 'translateY(30px)',
                            transition: `all 0.85s ${ease}`,
                        }}
                    >
                        <div
                            className="inline-block px-6 py-3 rounded-full font-bold mb-8 text-base"
                            style={{ backgroundColor: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}
                        >
                            OUR ECOSYSTEM
                        </div>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ color: '#ffffff' }}>
                            Empowering Rwanda's Digital Future
                        </h2>
                        <p className="text-xl lg:text-2xl max-w-4xl mx-auto" style={{ color: '#d1d5db' }}>
                            Four powerful platforms designed to transform education, business, and innovation across Africa
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div ref={featuresGridRef} className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-24">
                        {FEATURES.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(item.url)}
                                className="group p-8 rounded-3xl cursor-pointer hover:bg-gray-800"
                                style={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #4b5563',
                                    opacity: featuresGridInView ? 1 : 0,
                                    transform: featuresGridInView
                                        ? 'translateX(0) translateY(0)'
                                        : i % 2 === 0 ? 'translateX(-45px) translateY(20px)' : 'translateX(45px) translateY(20px)',
                                    transition: `opacity 0.8s ease ${0.15 + i * 0.14}s, transform 0.8s ${ease} ${0.15 + i * 0.14}s`,
                                }}
                            >
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>{item.title}</h3>
                                <p className="text-base font-medium mb-6 leading-relaxed" style={{ color: '#d1d5db' }}>{item.desc}</p>
                                <div className="space-y-3">
                                    {item.features.map((feature, j) => (
                                        <div key={j} className="flex items-center gap-3 text-base font-semibold" style={{ color: '#e5e7eb' }}>
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-r ${item.color}`} />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div
                        ref={ctaRef}
                        className="text-center"
                        style={{
                            opacity: ctaInView ? 1 : 0,
                            transform: ctaInView ? 'translateY(0)' : 'translateY(24px)',
                            transition: `all 0.75s ${ease}`,
                        }}
                    >
                        <div className="inline-flex items-center gap-4 flex-wrap justify-center">
                            <button
                                onClick={() => navigate('/projects')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all"
                            >
                                Explore Our Projects
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="px-8 py-4 rounded-full text-lg font-bold transition-all hover:bg-gray-800 hover:scale-105"
                                style={{ backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #4b5563' }}
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
