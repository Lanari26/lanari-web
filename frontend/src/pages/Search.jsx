import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const allContent = [
    { title: 'Siri Market', desc: 'Buy & resell anywhere even without stock. Become a trader or seller online with zero inventory.', category: 'Product', icon: '🛍️', color: 'from-blue-500 to-cyan-400', url: '/siri', tags: ['e-commerce', 'shop', 'buy', 'sell', 'resell', 'market', 'trade', 'store', 'product', 'stock', 'inventory'] },
    { title: 'Rise Network', desc: 'Freelancing, jobs, internships & professional networking. Connect with professionals and grow your career.', category: 'Product', icon: '🚀', color: 'from-purple-500 to-pink-400', url: '/rise', tags: ['freelance', 'job', 'internship', 'career', 'network', 'hire', 'work', 'remote', 'professional'] },
    { title: 'Coding Academy', desc: 'Practical coding and digital skills training. Learn web development, mobile apps, and more.', category: 'Product', icon: '🎓', color: 'from-emerald-500 to-teal-400', url: '/academy', tags: ['learn', 'code', 'course', 'training', 'education', 'skill', 'web', 'development', 'programming', 'student'] },
    { title: 'AI Solutions', desc: 'Intelligent tools powered by AI — customer support, analytics, and automated documentation.', category: 'Product', icon: '🤖', color: 'from-orange-500 to-red-400', url: '/ai-products', tags: ['ai', 'artificial intelligence', 'machine learning', 'automation', 'smart', 'chatbot'] },
    { title: 'Cloud Services', desc: 'Scalable cloud hosting, storage, and CDN for your applications and websites.', category: 'Service', icon: '☁️', color: 'from-sky-500 to-blue-400', url: '/cloud', tags: ['cloud', 'hosting', 'server', 'storage', 'deploy', 'cdn', 'infrastructure'] },
    { title: 'Analytics Dashboard', desc: 'Data-driven insights and business intelligence to make smarter decisions.', category: 'Service', icon: '📊', color: 'from-indigo-500 to-purple-400', url: '/analytics', tags: ['analytics', 'data', 'dashboard', 'insights', 'metrics', 'report', 'statistics'] },
    { title: 'Lanari Mail', desc: 'Professional corporate email with custom domain — yourname@lanari.rw.', category: 'Service', icon: '✉️', color: 'from-red-500 to-pink-400', url: '/mail', tags: ['email', 'mail', 'inbox', 'message', 'corporate', 'communication'] },
    { title: 'Lanari Docs', desc: 'Create, collaborate, and share documents and technical documentation seamlessly.', category: 'Service', icon: '📄', color: 'from-yellow-500 to-orange-400', url: '/docs', tags: ['docs', 'document', 'documentation', 'write', 'wiki', 'knowledge'] },
    { title: 'Calendar', desc: 'Schedule events, meetings, and manage your time effectively.', category: 'Service', icon: '📅', color: 'from-green-500 to-emerald-400', url: '/calendar', tags: ['calendar', 'event', 'schedule', 'meeting', 'time', 'plan'] },
    { title: 'Partner with Us', desc: 'Join forces with Lanari Tech. Strategic partnerships for mutual growth.', category: 'Company', icon: '🤝', color: 'from-pink-500 to-rose-400', url: '/partner', tags: ['partner', 'collaborate', 'business', 'sponsor', 'alliance'] },
    { title: 'Invest in Lanari', desc: 'Investment opportunities in Africa\'s growing tech ecosystem.', category: 'Company', icon: '💎', color: 'from-amber-500 to-yellow-400', url: '/invest', tags: ['invest', 'funding', 'investor', 'equity', 'startup', 'venture', 'finance'] },
    { title: 'Careers', desc: 'Join our team — explore open positions in engineering, design, marketing, and more.', category: 'Company', icon: '💼', color: 'from-violet-500 to-purple-400', url: '/careers', tags: ['career', 'job', 'hire', 'apply', 'position', 'work', 'team', 'engineer', 'designer'] },
    { title: 'Contact Us', desc: 'Get in touch with Lanari Tech. We\'d love to hear from you.', category: 'Company', icon: '📬', color: 'from-teal-500 to-cyan-400', url: '/contact', tags: ['contact', 'support', 'help', 'reach', 'phone', 'email', 'location'] },
    { title: 'About Lanari Tech', desc: 'Our mission, values, and the story behind empowering Rwanda\'s digital future.', category: 'Company', icon: '🏢', color: 'from-blue-500 to-indigo-400', url: '/about', tags: ['about', 'mission', 'values', 'story', 'team', 'company', 'who'] },
    { title: 'Our Services', desc: 'Full-stack digital solutions — web, mobile, cloud, and AI development.', category: 'Company', icon: '⚙️', color: 'from-gray-500 to-slate-400', url: '/services', tags: ['service', 'solution', 'consulting', 'development', 'web', 'mobile', 'app'] },
    { title: 'Projects', desc: 'Featured projects and case studies showcasing what we\'ve built.', category: 'Company', icon: '🏗️', color: 'from-cyan-500 to-blue-400', url: '/projects', tags: ['project', 'portfolio', 'case study', 'showcase', 'build'] },
];

export default function Search() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);

    const results = useMemo(() => {
        if (!query.trim()) return allContent;
        const q = query.toLowerCase().trim();
        const words = q.split(/\s+/);

        return allContent
            .map(item => {
                let score = 0;
                const titleLower = item.title.toLowerCase();
                const descLower = item.desc.toLowerCase();
                const tagsJoined = item.tags.join(' ');

                if (titleLower === q) score += 100;
                if (titleLower.includes(q)) score += 50;
                if (descLower.includes(q)) score += 20;
                if (tagsJoined.includes(q)) score += 30;

                words.forEach(word => {
                    if (titleLower.includes(word)) score += 15;
                    if (descLower.includes(word)) score += 5;
                    item.tags.forEach(tag => {
                        if (tag.includes(word)) score += 10;
                    });
                });

                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const categories = [...new Set(results.map(r => r.category))];

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: '#0a0e1a' }}>
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 left-1/4" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)' }} />
                <div className="absolute w-[400px] h-[400px] rounded-full blur-3xl bottom-1/4 right-0" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)' }} />
            </div>

            {/* Search Header */}
            <div className="sticky top-[73px] z-40 backdrop-blur-xl px-4 py-4" style={{ backgroundColor: 'rgba(10, 14, 26, 0.9)', borderBottom: '1px solid rgba(75, 85, 99, 0.3)' }}>
                <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 rounded-2xl px-5 py-3" style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}>
                        <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Lanari Tech..."
                            autoFocus
                            className="flex-1 bg-transparent text-base font-medium outline-none placeholder-gray-500 min-w-0"
                            style={{ color: '#ffffff' }}
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4" style={{ color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate(`/ai?q=${encodeURIComponent(query)}`)}
                            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/40 transition-all flex-shrink-0"
                        >
                            AI Mode
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                {/* Results count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
                        {query.trim()
                            ? <>{results.length} result{results.length !== 1 ? 's' : ''} for "<span style={{ color: '#e5e7eb' }}>{query}</span>"</>
                            : <>Browse all Lanari Tech products & services</>
                        }
                    </p>
                </div>

                {results.length === 0 ? (
                    /* No Results */
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🔍</div>
                        <h2 className="text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>No results found</h2>
                        <p className="text-base font-medium mb-8" style={{ color: '#9ca3af' }}>
                            We couldn't find anything matching "<span style={{ color: '#e5e7eb' }}>{query}</span>"
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Try searching for:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['Siri', 'Rise', 'Academy', 'Cloud', 'Jobs', 'AI'].map((s, i) => (
                                    <button key={i} onClick={() => setQuery(s)} className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-gray-700" style={{ backgroundColor: '#1f2937', color: '#d1d5db', border: '1px solid #4b5563' }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate(`/ai?q=${encodeURIComponent(query)}`)}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-base font-bold text-white hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                            >
                                Ask AI instead
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Grouped Results */
                    <div className="space-y-8">
                        {categories.map(cat => (
                            <div key={cat}>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 px-1" style={{ color: '#6b7280' }}>{cat}s</h3>
                                <div className="space-y-3">
                                    {results.filter(r => r.category === cat).map((item, i) => (
                                        <div
                                            key={i}
                                            onClick={() => navigate(item.url)}
                                            className="group flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
                                            style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#6b7280'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = '#374151'}
                                        >
                                            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors" style={{ color: '#ffffff' }}>{item.title}</h4>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd' }}>{item.category}</span>
                                                </div>
                                                <p className="text-sm font-medium leading-relaxed" style={{ color: '#9ca3af' }}>{item.desc}</p>
                                            </div>
                                            <svg className="w-5 h-5 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6b7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
