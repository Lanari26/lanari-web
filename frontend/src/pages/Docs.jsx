import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORY_STYLES = {
    'Getting Started': { color: 'from-emerald-500 to-teal-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', accent: 'border-emerald-500/50', glow: 'group-hover:shadow-emerald-500/10' },
    'Products': { color: 'from-blue-500 to-cyan-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', accent: 'border-blue-500/50', glow: 'group-hover:shadow-blue-500/10' },
    'User Guide': { color: 'from-purple-500 to-pink-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', accent: 'border-purple-500/50', glow: 'group-hover:shadow-purple-500/10' },
    'Business': { color: 'from-amber-500 to-orange-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', accent: 'border-amber-500/50', glow: 'group-hover:shadow-amber-500/10' },
};

const DEFAULT_STYLE = { color: 'from-gray-500 to-gray-400', badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20', accent: 'border-gray-500/50', glow: 'group-hover:shadow-gray-500/10' };

function getCatStyle(category) {
    return CATEGORY_STYLES[category] || DEFAULT_STYLE;
}

function renderMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/^#### (.+)$/gm, '<h4 class="text-[15px] font-bold text-gray-200 mt-5 mb-2">$1</h4>')
        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-8 mb-3 pb-2" style="border-bottom: 1px solid #1f2937">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-200 font-semibold">$1</strong>')
        .replace(/^- (.+)$/gm, '<div class="flex gap-2 ml-1 mb-1.5"><span class="text-blue-400 mt-0.5 flex-shrink-0">&#9679;</span><span class="text-gray-400 leading-relaxed">$1</span></div>')
        .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2.5 ml-1 mb-1.5"><span class="text-blue-400 font-bold flex-shrink-0 min-w-[20px]">$1.</span><span class="text-gray-400 leading-relaxed">$2</span></div>')
        .replace(/\n\n/g, '</p><p class="text-gray-400 leading-[1.8] mb-3">')
        .replace(/\n/g, '<br/>');
}

export default function Docs() {
    const [docs, setDocs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [mobileSidebar, setMobileSidebar] = useState(false);

    useEffect(() => {
        fetch(`${API}/docs`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setDocs(data.data);
                    const cats = {};
                    data.data.forEach(d => {
                        cats[d.category] = (cats[d.category] || 0) + 1;
                    });
                    setCategories(Object.entries(cats).map(([name, count]) => ({ name, count })));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = docs.filter(d => {
        if (selectedCategory && d.category !== selectedCategory) return false;
        if (search) {
            const q = search.toLowerCase();
            return d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
        }
        return true;
    });

    const grouped = {};
    filtered.forEach(d => {
        if (!grouped[d.category]) grouped[d.category] = [];
        grouped[d.category].push(d);
    });

    // Find next/prev doc for navigation
    const currentIndex = selectedDoc ? docs.findIndex(d => d.id === selectedDoc.id) : -1;
    const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
    const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    // ─── Article View ─────────────────────────────────────
    if (selectedDoc) {
        const style = getCatStyle(selectedDoc.category);
        return (
            <div className="min-h-screen py-24 px-6 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-3xl mx-auto relative z-10">
                    {/* Back button */}
                    <button
                        onClick={() => setSelectedDoc(null)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-white transition-colors mb-10 group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        All Documentation
                    </button>

                    {/* Article header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">{selectedDoc.icon}</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${style.badge}`}>
                                {selectedDoc.category}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3 leading-tight">{selectedDoc.title}</h1>
                        <p className="text-sm text-gray-600">
                            Last updated {new Date(selectedDoc.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Article body */}
                    <article
                        className="p-8 md:p-10 rounded-3xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm"
                    >
                        <div
                            className="text-gray-400 text-[15px] leading-[1.8]"
                            dangerouslySetInnerHTML={{ __html: '<p class="text-gray-400 leading-[1.8] mb-3">' + renderMarkdown(selectedDoc.content) + '</p>' }}
                        />
                    </article>

                    {/* Prev / Next navigation */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {prevDoc ? (
                            <button
                                onClick={() => setSelectedDoc(prevDoc)}
                                className="text-left p-5 rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600 transition-all group"
                            >
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Previous</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors truncate">{prevDoc.title}</span>
                                </div>
                            </button>
                        ) : <div />}
                        {nextDoc ? (
                            <button
                                onClick={() => setSelectedDoc(nextDoc)}
                                className="text-right p-5 rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600 transition-all group"
                            >
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Next</span>
                                <div className="flex items-center justify-end gap-2 mt-1">
                                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors truncate">{nextDoc.title}</span>
                                    <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        ) : <div />}
                    </div>
                </div>
            </div>
        );
    }

    // ─── List View ────────────────────────────────────────
    return (
        <div className="min-h-screen py-24 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-block px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 font-bold text-sm mb-6 border border-yellow-500/20">
                        DOCUMENTATION
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Lanari Docs
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about Lanari Tech products and services.
                        Browse guides, tutorials, and references.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto mb-14">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative">
                            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all backdrop-blur-sm"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    {search && (
                        <p className="text-center text-sm text-gray-600 mt-3">
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<span className="text-gray-400">{search}</span>"
                        </p>
                    )}
                </div>

                <div className="flex gap-10">
                    {/* Mobile sidebar toggle */}
                    <button
                        onClick={() => setMobileSidebar(!mobileSidebar)}
                        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Sidebar */}
                    <aside className={`${mobileSidebar ? 'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm' : 'hidden'} md:block md:relative md:bg-transparent`}
                        onClick={(e) => { if (e.target === e.currentTarget) setMobileSidebar(false); }}
                    >
                        <div className={`${mobileSidebar ? 'absolute left-0 top-0 h-full w-72 p-6 shadow-2xl' : 'w-52 flex-shrink-0 sticky top-28'}`}
                            style={mobileSidebar ? { backgroundColor: '#0f1629' } : {}}
                        >
                            {mobileSidebar && (
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold text-white">Categories</h3>
                                    <button onClick={() => setMobileSidebar(false)} className="text-gray-400 hover:text-white">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {!mobileSidebar && (
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-3">Browse</h3>
                            )}
                            <nav className="space-y-1">
                                <button
                                    onClick={() => { setSelectedCategory(null); setMobileSidebar(false); }}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        !selectedCategory
                                            ? 'bg-white/[0.07] text-white'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>All Docs</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${!selectedCategory ? 'bg-blue-500/15 text-blue-400' : 'bg-gray-800 text-gray-600'}`}>{docs.length}</span>
                                    </div>
                                </button>
                                {categories.map(cat => {
                                    const active = selectedCategory === cat.name;
                                    const style = getCatStyle(cat.name);
                                    return (
                                        <button
                                            key={cat.name}
                                            onClick={() => { setSelectedCategory(cat.name); setMobileSidebar(false); }}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                active
                                                    ? 'bg-white/[0.07] text-white'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{cat.name}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${active ? style.badge : 'bg-gray-800 text-gray-600'}`}>{cat.count}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Quick links */}
                            <div className="mt-8 pt-6" style={{ borderTop: '1px solid #1f2937' }}>
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">Quick Links</h3>
                                <nav className="space-y-0.5">
                                    {[
                                        { label: 'Contact Support', href: '/contact', icon: '💬' },
                                        { label: 'AI Assistant', href: '/ai', icon: '🤖' },
                                    ].map(link => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-all"
                                        >
                                            <span className="text-sm">{link.icon}</span>
                                            <span>{link.label}</span>
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {Object.keys(grouped).length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-center text-3xl">
                                    📄
                                </div>
                                <p className="text-gray-400 font-semibold text-lg">No documents found</p>
                                {search && <p className="text-gray-600 text-sm mt-2">Try a different search term</p>}
                            </div>
                        ) : (
                            Object.entries(grouped).map(([category, categoryDocs]) => {
                                const style = getCatStyle(category);
                                return (
                                    <div key={category} className="mb-12">
                                        <div className="flex items-center gap-3 mb-5">
                                            <h2 className="text-xl font-bold text-white">{category}</h2>
                                            <div className="flex-1 h-px bg-gray-800" />
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${style.badge}`}>
                                                {categoryDocs.length} article{categoryDocs.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {categoryDocs.map(doc => (
                                                <button
                                                    key={doc.id}
                                                    onClick={() => setSelectedDoc(doc)}
                                                    className={`text-left p-6 rounded-2xl transition-all duration-200 group hover:shadow-xl ${style.glow}`}
                                                    style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', border: '1px solid #1f2937' }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1f2937'}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-11 h-11 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                                                            {doc.icon}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-[15px] font-bold text-gray-200 group-hover:text-white transition-colors mb-1.5 leading-snug">
                                                                {doc.title}
                                                            </h3>
                                                            <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                                                                {doc.content.replace(/[#*\-\n]/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 100)}
                                                            </p>
                                                        </div>
                                                        <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-all duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
