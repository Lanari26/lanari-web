import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Home() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        const timer = setInterval(() => setTime(new Date()), 1000);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(timer);
        };
    }, []);

    return (
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
                                url: '/siri',
                                highlight: true
                            },
                            {
                                icon: '🚀',
                                title: 'Rise',
                                desc: 'Freelancing & networking',
                                color: 'from-purple-500 to-pink-400',
                                url: '/rise',
                                highlight: true
                            },
                            {
                                icon: '🎓',
                                title: 'Coding Academy',
                                desc: 'Practical digital skills',
                                color: 'from-emerald-500 to-teal-400',
                                url: '/academy',
                                highlight: true
                            },
                            {
                                icon: '💡',
                                title: 'Digital Solutions',
                                desc: 'Innovative tech tools',
                                color: 'from-orange-500 to-red-400',
                                url: '/ai-products',
                                highlight: true
                            }
                        ].map((card, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(card.url)}
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
                                    <span>Learn more</span>
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
                                color: 'from-blue-500 to-cyan-400',
                                url: '/siri'
                            },
                            {
                                icon: '',
                                title: 'Rise Network',
                                desc: 'Enables communication, networking, freelancing, and access to online job opportunities. Connect with professionals and grow your career.',
                                features: ['Freelance Projects', 'Professional Network', 'Remote Jobs', 'Skill Sharing'],
                                color: 'from-purple-500 to-pink-400',
                                url: '/rise'
                            },
                            {
                                icon: '🎓',
                                title: 'Lanari Coding Academy',
                                desc: 'Provides practical coding and digital skills training to help students and professionals thrive in the fast-evolving tech industry.',
                                features: ['Practical Training', 'Industry Skills', 'Mentorship', 'Career Growth'],
                                color: 'from-emerald-500 to-teal-400',
                                url: '/academy'
                            },
                            {
                                icon: '💡',
                                title: 'Innovative Solutions',
                                desc: 'We create tools and platforms that make life easier, opportunities accessible, and technology beneficial for everyone.',
                                features: ['Digital Transformation', 'Custom Platforms', 'Tech Consulting', 'Future Ready'],
                                color: 'from-orange-500 to-red-400',
                                url: '/ai-products'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(item.url)}
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
                            <button onClick={() => navigate('/projects')} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                                Explore Our Projects
                            </button>
                            <button onClick={() => navigate('/contact')} className="px-8 py-4 rounded-full text-lg font-bold transition-all hover:bg-gray-800" style={{ backgroundColor: '#1f2937', color: '#ffffff', border: '1px solid #4b5563' }}>
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
}
