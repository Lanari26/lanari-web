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
    { icon: '🤖', title: 'AI-Powered', desc: 'Smart tools & intelligent assistant', color: 'from-orange-500 to-red-400', url: '/ai-products' },
];

const FEATURES = [
    { icon: '🛍️', title: 'Siri Market', desc: 'Become a trader or seller anywhere even without physical stock. Buy goods online and resell them easily, allowing anyone to shop from wherever they are.', features: ['Zero Inventory Model', 'Global Marketplace', 'Easy Reselling', 'Secure Payments'], color: 'from-blue-500 to-cyan-400', url: '/siri' },
    { icon: '🌐', title: 'Rise Network', desc: 'Enables communication, networking, freelancing, and access to online job and internship opportunities. Connect with professionals and grow your career.', features: ['Freelance Projects', 'Professional Network', 'Remote Jobs', 'Skill Sharing'], color: 'from-purple-500 to-pink-400', url: '/rise' },
    { icon: '🎓', title: 'Lanari Coding Academy', desc: 'Provides practical coding and digital skills training to help students and professionals thrive in the fast-evolving tech industry.', features: ['Practical Training', 'Industry Skills', 'Mentorship', 'Career Growth'], color: 'from-emerald-500 to-teal-400', url: '/academy' },
    { icon: '🤖', title: 'AI-Powered Solutions', desc: 'Our platforms are enhanced with artificial intelligence — from our smart AI assistant to intelligent search, automated insights, and personalized recommendations.', features: ['AI Chat Assistant', 'Smart Search', 'Intelligent Analytics', 'Automated Workflows'], color: 'from-orange-500 to-red-400', url: '/ai-products' },
];

const SUGGESTIONS = [
    { label: 'Siri Platform', path: '/siri' },
    { label: 'Rise Platform', path: '/rise' },
    { label: 'Learn Coding', path: '/academy' },
    { label: 'AI Solutions', path: '/ai-products' },
];

const STATS = [
    { value: '4', label: 'Core Projects', gradient: 'from-blue-400 to-purple-400' },
    { value: '24/7', label: 'Available', gradient: 'from-purple-400 to-pink-400' },
    { value: 'AI', label: 'Powered', gradient: 'from-emerald-400 to-teal-400' },
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

            {/* ── Animated Tech Background ── */}
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
                {/* Ambient orbs */}
                <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl top-1/4 right-0 animate-float"
                    style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.05) 100%)' }} />
                <div className="absolute w-[450px] h-[450px] rounded-full blur-3xl bottom-0 left-1/3 animate-float-slow"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(20,184,166,0.04) 100%)' }} />

                {/* ── Twinkling Stars ── */}
                {[
                    { top: '5%', left: '10%', size: 3, delay: 0, dur: 3 },
                    { top: '12%', left: '25%', size: 2, delay: 1.2, dur: 4 },
                    { top: '8%', left: '45%', size: 2.5, delay: 0.5, dur: 2.5 },
                    { top: '15%', left: '65%', size: 3, delay: 2, dur: 3.5 },
                    { top: '3%', left: '80%', size: 2, delay: 0.8, dur: 4.5 },
                    { top: '20%', left: '92%', size: 2.5, delay: 1.5, dur: 3 },
                    { top: '30%', left: '5%', size: 2, delay: 2.5, dur: 4 },
                    { top: '35%', left: '35%', size: 3, delay: 0.3, dur: 2.8 },
                    { top: '28%', left: '55%', size: 2, delay: 1.8, dur: 3.2 },
                    { top: '40%', left: '75%', size: 2.5, delay: 3, dur: 3.8 },
                    { top: '45%', left: '15%', size: 2, delay: 0.7, dur: 4.2 },
                    { top: '50%', left: '88%', size: 3, delay: 2.2, dur: 2.6 },
                    { top: '55%', left: '42%', size: 2, delay: 1, dur: 3.5 },
                    { top: '62%', left: '8%', size: 2.5, delay: 3.5, dur: 3 },
                    { top: '58%', left: '68%', size: 2, delay: 0.4, dur: 4 },
                    { top: '70%', left: '30%', size: 3, delay: 2.8, dur: 2.5 },
                    { top: '75%', left: '52%', size: 2, delay: 1.6, dur: 3.8 },
                    { top: '68%', left: '85%', size: 2.5, delay: 0.9, dur: 3.2 },
                    { top: '82%', left: '20%', size: 2, delay: 3.2, dur: 4.5 },
                    { top: '85%', left: '60%', size: 3, delay: 0.6, dur: 2.8 },
                    { top: '90%', left: '40%', size: 2, delay: 2.4, dur: 3.5 },
                    { top: '88%', left: '95%', size: 2.5, delay: 1.3, dur: 3 },
                    { top: '95%', left: '12%', size: 2, delay: 3.8, dur: 4 },
                    { top: '92%', left: '72%', size: 3, delay: 0.2, dur: 2.5 },
                ].map((star, i) => (
                    <div
                        key={`star-${i}`}
                        className="absolute rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            backgroundColor: '#ffffff',
                            boxShadow: `0 0 ${star.size * 3}px #ffffff, 0 0 ${star.size * 6}px rgba(147,197,253,0.5)`,
                            animation: `twinkle ${star.dur}s ease-in-out infinite ${star.delay}s`,
                        }}
                    />
                ))}

                {/* ── Electron Orbit System — Top Right ── */}
                <div className="absolute" style={{ top: '10%', right: '10%', width: 280, height: 280 }}>
                    {/* Nucleus glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#3b82f6', boxShadow: '0 0 20px #3b82f6, 0 0 40px #3b82f680', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                    {/* Orbit rings */}
                    {[
                        { radius: 60, dur: 4, color: '#3b82f6', tilt: 'rotateX(65deg)' },
                        { radius: 90, dur: 6, color: '#a855f7', tilt: 'rotateX(65deg) rotateY(30deg)' },
                        { radius: 120, dur: 8, color: '#06b6d4', tilt: 'rotateX(65deg) rotateY(-30deg)' },
                    ].map((o, i) => (
                        <div key={`orbit1-${i}`} className="absolute top-1/2 left-1/2" style={{ width: o.radius * 2, height: o.radius * 2, marginLeft: -o.radius, marginTop: -o.radius, transform: o.tilt }}>
                            {/* Ring */}
                            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${o.color}30` }} />
                            {/* Electron */}
                            <div className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0, animation: `electron-orbit ${o.dur}s linear infinite`, '--radius': `${o.radius}px` }}>
                                <div className="rounded-full" style={{ width: 6, height: 6, marginLeft: -3, marginTop: -3, backgroundColor: o.color, boxShadow: `0 0 8px ${o.color}, 0 0 16px ${o.color}80` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Electron Orbit System — Bottom Left ── */}
                <div className="absolute" style={{ bottom: '15%', left: '8%', width: 220, height: 220 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#a855f7', boxShadow: '0 0 16px #a855f7, 0 0 32px #a855f780', animation: 'pulse-glow 2.5s ease-in-out infinite' }} />
                    {[
                        { radius: 45, dur: 3.5, color: '#a855f7', tilt: 'rotateX(70deg)' },
                        { radius: 75, dur: 5.5, color: '#3b82f6', tilt: 'rotateX(70deg) rotateY(40deg)' },
                        { radius: 100, dur: 7, color: '#10b981', tilt: 'rotateX(70deg) rotateY(-25deg)' },
                    ].map((o, i) => (
                        <div key={`orbit2-${i}`} className="absolute top-1/2 left-1/2" style={{ width: o.radius * 2, height: o.radius * 2, marginLeft: -o.radius, marginTop: -o.radius, transform: o.tilt }}>
                            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${o.color}30` }} />
                            <div className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0, animation: `electron-orbit ${o.dur}s linear infinite reverse`, '--radius': `${o.radius}px` }}>
                                <div className="rounded-full" style={{ width: 5, height: 5, marginLeft: -2.5, marginTop: -2.5, backgroundColor: o.color, boxShadow: `0 0 6px ${o.color}, 0 0 14px ${o.color}80` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Floating Particles rising up ── */}
                {[
                    { left: '5%',  size: 5, delay: 0,  dur: 14, color: '#3b82f6' },
                    { left: '18%', size: 4, delay: 3,  dur: 18, color: '#a855f7' },
                    { left: '30%', size: 6, delay: 6,  dur: 11, color: '#06b6d4' },
                    { left: '42%', size: 4, delay: 1,  dur: 16, color: '#8b5cf6' },
                    { left: '55%', size: 5, delay: 8,  dur: 13, color: '#3b82f6' },
                    { left: '67%', size: 4, delay: 4,  dur: 19, color: '#10b981' },
                    { left: '80%', size: 5, delay: 2,  dur: 15, color: '#a855f7' },
                    { left: '92%', size: 4, delay: 7,  dur: 12, color: '#06b6d4' },
                ].map((p, i) => (
                    <div key={`particle-${i}`} className="absolute rounded-full"
                        style={{
                            left: p.left, bottom: '-10px', width: p.size, height: p.size,
                            backgroundColor: p.color,
                            boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}40`,
                            animation: `drift-up ${p.dur}s linear infinite ${p.delay}s`,
                        }}
                    />
                ))}

                {/* ── Floating Code Symbols ── */}
                {['</', '/>', '{ }', '( )', '01', 'AI', '< >', '&&'].map((sym, i) => (
                    <span key={`code-${i}`} className="absolute font-mono font-bold select-none"
                        style={{
                            left: `${6 + i * 12}%`, bottom: '-30px',
                            fontSize: `${16 + (i % 3) * 6}px`,
                            color: ['#3b82f6', '#a855f7', '#06b6d4', '#10b981', '#8b5cf6', '#3b82f6', '#a855f7', '#06b6d4'][i],
                            textShadow: `0 0 10px ${['#3b82f6', '#a855f7', '#06b6d4', '#10b981', '#8b5cf6', '#3b82f6', '#a855f7', '#06b6d4'][i]}60`,
                            animation: `code-float ${9 + i * 2}s linear infinite ${i * 1.5}s`,
                        }}
                    >{sym}</span>
                ))}

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
            <section className="py-32 lg:py-48 px-8 relative overflow-hidden">
                {/* Electron orbit system — center background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 500, height: 500 }}>
                    {/* Nucleus */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#8b5cf6', boxShadow: '0 0 20px #8b5cf6, 0 0 40px #8b5cf660', animation: 'pulse-glow 3s ease-in-out infinite' }} />
                    {[
                        { radius: 80, dur: 6, color: '#3b82f6', tilt: 'rotateX(75deg)' },
                        { radius: 140, dur: 10, color: '#a855f7', tilt: 'rotateX(75deg) rotateY(35deg)' },
                        { radius: 200, dur: 14, color: '#06b6d4', tilt: 'rotateX(75deg) rotateY(-35deg)' },
                    ].map((o, i) => (
                        <div key={`eco-orbit-${i}`} className="absolute top-1/2 left-1/2" style={{ width: o.radius * 2, height: o.radius * 2, marginLeft: -o.radius, marginTop: -o.radius, transform: o.tilt, opacity: 0.25 }}>
                            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${o.color}` }} />
                            <div className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0, animation: `electron-orbit ${o.dur}s linear infinite`, '--radius': `${o.radius}px` }}>
                                <div className="rounded-full" style={{ width: 6, height: 6, marginLeft: -3, marginTop: -3, backgroundColor: o.color, boxShadow: `0 0 8px ${o.color}, 0 0 16px ${o.color}` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="max-w-[90%] mx-auto relative z-10">

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
                            AI-powered platforms designed to transform education, business, and innovation across Africa
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
