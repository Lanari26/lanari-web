import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';

const suggestions = [
    { text: 'What is Siri Market?', icon: '🛍️' },
    { text: 'How can I learn coding?', icon: '🎓' },
    { text: 'Find me a freelance job', icon: '🚀' },
    { text: 'Tell me about cloud services', icon: '☁️' },
];

const knowledgeBase = [
    { keys: ['siri', 'market', 'shop', 'buy', 'sell', 'resell', 'e-commerce', 'ecommerce', 'store', 'product', 'trade', 'stock', 'inventory'], answer: '**Siri Market** is Lanari Tech\'s e-commerce platform that lets you buy and resell products — even without holding any physical stock.\n\nWith Siri, you can:\n- Start selling online with **zero inventory**\n- Access a **global marketplace** of products\n- Earn through easy **reselling**\n- Process **secure payments** seamlessly\n\nIt\'s designed so anyone in Rwanda and beyond can become a digital trader. Want to explore Siri Market?', link: '/siri' },
    { keys: ['rise', 'freelance', 'job', 'internship', 'career', 'hire', 'work', 'remote', 'network', 'professional', 'employ'], answer: '**Rise Network** is your gateway to professional growth and opportunities.\n\nHere\'s what Rise offers:\n- **Freelance projects** — find clients and get hired for your skills\n- **Job listings** — browse remote and local opportunities\n- **Internship programs** — kickstart your career with hands-on experience\n- **Professional networking** — connect with industry leaders across Africa\n\nWhether you\'re a developer, designer, marketer, or any professional — Rise connects talent with opportunity.', link: '/rise' },
    { keys: ['academy', 'learn', 'code', 'coding', 'course', 'training', 'education', 'programming', 'skill', 'student', 'web development', 'mobile'], answer: '**Lanari Coding Academy** provides practical, hands-on digital skills training.\n\nAvailable courses include:\n- 🌐 **Web Development** — HTML, CSS, JavaScript, React\n- 📱 **Mobile Development** — Build apps for Android & iOS\n- 🐍 **Python & Data Science** — Analytics and automation\n- 🎨 **UI/UX Design** — Create beautiful user experiences\n- ☁️ **Cloud & DevOps** — Deploy and scale applications\n- 🤖 **AI & Machine Learning** — Build intelligent systems\n\nMany courses start **free**, and we offer mentorship to help you grow. Ready to start learning?', link: '/academy' },
    { keys: ['ai', 'artificial intelligence', 'machine learning', 'automation', 'chatbot', 'smart', 'intelligent'], answer: '**Lanari AI Solutions** brings the power of artificial intelligence to your business.\n\nOur AI products include:\n- 🤖 **AI Customer Support** — Automated chatbots that understand your customers\n- 📊 **AI Analytics** — Smart insights from your business data\n- 📄 **Auto Documentation** — AI-powered technical docs generation\n\nWe help businesses in Rwanda and across Africa leverage AI to work smarter, not harder.', link: '/ai-products' },
    { keys: ['cloud', 'hosting', 'server', 'storage', 'deploy', 'cdn', 'infrastructure', 'host'], answer: '**Lanari Cloud** provides reliable, scalable cloud infrastructure.\n\nOur cloud services:\n- 🖥️ **Web Hosting** — Fast, reliable hosting for your websites\n- 💾 **Cloud Storage** — Secure file storage with easy access\n- 🌐 **CDN** — Global content delivery for blazing-fast load times\n- ⚡ **Auto-scaling** — Your infrastructure grows with your traffic\n\nBuilt for African businesses with competitive pricing and local support.', link: '/cloud' },
    { keys: ['partner', 'collaborate', 'partnership', 'sponsor', 'alliance', 'business partner'], answer: '**Partner with Lanari Tech** and grow together!\n\nWe offer partnerships in:\n- 🏢 **Technology Partnerships** — Integrate with our ecosystem\n- 📢 **Marketing Alliances** — Co-promote and reach new audiences\n- 🎓 **Educational Partnerships** — Collaborate on training programs\n- 🌍 **Community Partnerships** — Drive digital inclusion across Africa\n\nReady to explore a partnership?', link: '/partner' },
    { keys: ['invest', 'funding', 'investor', 'equity', 'startup', 'venture', 'finance', 'money', 'capital'], answer: '**Invest in Lanari Tech** — be part of Africa\'s digital transformation.\n\nWhy invest:\n- 📈 **Growing market** — Africa\'s tech sector is booming\n- 🏗️ **4 core products** — diversified portfolio of digital solutions\n- 🌍 **Social impact** — empowering communities through technology\n- 🚀 **Early stage** — significant growth potential\n\nContact our investment team to learn more or request our investor deck.', link: '/invest' },
    { keys: ['career', 'hiring', 'position', 'apply', 'team', 'engineer', 'designer', 'developer'], answer: '**Join the Lanari Tech team!** We\'re always looking for talented people.\n\nOpen positions include:\n- 👨‍💻 **Full Stack Developer** — React, Node.js, cloud\n- 🎨 **UI/UX Designer** — Create beautiful digital experiences\n- 📱 **Mobile Developer** — React Native & Flutter\n- 📈 **Marketing Lead** — Drive growth and brand awareness\n\nWe offer competitive packages, remote flexibility, and the chance to shape Africa\'s digital future.', link: '/careers' },
    { keys: ['contact', 'support', 'help', 'reach', 'phone', 'email', 'location', 'address', 'whatsapp'], answer: '**Get in touch with Lanari Tech!**\n\nHere\'s how to reach us:\n- 📧 **Email:** lanari.rw@gmail.com\n- 📱 **WhatsApp:** +250 795 983 610\n- 🌐 **Website:** lanari.rw\n- 📍 **Location:** Kigali, Rwanda\n\nYou can also reach specific teams:\n- Careers: careers@lanari.rw\n- Support: support@lanari.rw\n- Investment: invest@lanari.rw\n\nWe typically respond within 24 hours!', link: '/contact' },
    { keys: ['about', 'lanari', 'company', 'mission', 'who', 'what', 'story', 'values', 'rwanda'], answer: '**Lanari Tech** is a Rwandan technology company on a mission to empower Africa\'s digital future.\n\nOur core values:\n- 💡 **Innovation** — Pushing boundaries with creative solutions\n- 🤝 **Integrity** — Building trust through transparency\n- 🌍 **Impact** — Creating real change in communities\n- 🫂 **Inclusion** — Technology that\'s accessible to everyone\n\nWe build platforms for e-commerce (Siri), professional networking (Rise), education (Academy), and digital solutions — all designed for the African market.', link: '/about' },
    { keys: ['mail', 'email service', 'inbox', 'corporate email'], answer: '**Lanari Mail** is our professional corporate email service.\n\nGet a professional email address like **you@lanari.rw** with:\n- 📥 Clean, modern inbox interface\n- 🔒 Enterprise-grade security\n- 📎 Large attachment support\n- 📱 Access from any device\n\nPerfect for businesses that want a professional communication setup.', link: '/mail' },
    { keys: ['analytics', 'data', 'dashboard', 'insights', 'metrics', 'report', 'statistics'], answer: '**Lanari Analytics** provides powerful data insights for your business.\n\nFeatures include:\n- 📊 **Real-time dashboards** — Monitor your KPIs live\n- 📈 **Growth analytics** — Track users, revenue, and engagement\n- 🎯 **Custom reports** — Build reports tailored to your needs\n- 🔍 **Deep insights** — Understand your data with AI-powered analysis\n\nMake data-driven decisions with confidence.', link: '/analytics' },
];

function getAiResponse(input) {
    const q = input.toLowerCase().trim();

    if (['hi', 'hello', 'hey', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'].some(g => q.includes(g))) {
        return { text: 'Hello! 👋 I\'m **Lanari AI**, your intelligent assistant.\n\nI can help you explore everything Lanari Tech offers — from our e-commerce platform **Siri**, to **Rise** for jobs and freelancing, our **Coding Academy**, and much more.\n\nWhat would you like to know?', link: null };
    }

    if (['thank', 'thanks', 'thx', 'appreciate'].some(g => q.includes(g))) {
        return { text: 'You\'re welcome! 😊 Let me know if there\'s anything else I can help with.\n\nFeel free to ask about any of our products, services, or opportunities!', link: null };
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of knowledgeBase) {
        let score = 0;
        for (const key of entry.keys) {
            if (q.includes(key)) {
                score += key.length;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && bestScore >= 2) {
        return { text: bestMatch.answer, link: bestMatch.link };
    }

    return {
        text: 'I appreciate your question! While I may not have specific details on that topic, here\'s what I can help you with:\n\n- 🛍️ **Siri Market** — E-commerce & reselling\n- 🚀 **Rise Network** — Jobs, freelancing & networking\n- 🎓 **Coding Academy** — Learn digital skills\n- 🤖 **AI Solutions** — Smart business tools\n- ☁️ **Cloud Services** — Hosting & infrastructure\n- 💼 **Careers** — Join our team\n- 🤝 **Partnerships** — Collaborate with us\n\nTry asking about any of these topics!',
        link: null
    };
}

export default function AiChat() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const hasSentInitial = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (initialQuery.trim() && !hasSentInitial.current) {
            hasSentInitial.current = true;
            sendMessage(initialQuery);
        }
    }, []);

    const sendMessage = (text) => {
        const userMsg = text || input;
        if (!userMsg.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: userMsg.trim() }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const response = getAiResponse(userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: response.text, link: response.link }]);
            setIsTyping(false);
        }, 600 + Math.random() * 800);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const isEmpty = messages.length === 0 && !isTyping;

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[600px] h-[600px] rounded-full blur-3xl top-1/4 left-1/4" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)' }} />
                <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)' }} />
            </div>

            {/* Top bar */}
            <div className="sticky top-0 z-40 backdrop-blur-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(10, 14, 26, 0.9)', borderBottom: '1px solid rgba(75, 85, 99, 0.3)' }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src={logo} alt="Lanari" className="w-8 h-8 rounded-xl shadow-lg shadow-blue-500/20" />
                    </button>
                    <div className="w-px h-6" style={{ backgroundColor: '#374151' }} />
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold" style={{ color: '#ffffff' }}>Lanari AI</h1>
                        <p className="text-[11px] font-medium" style={{ color: '#6b7280' }}>Powered by Lanari Tech</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/search?q=${encodeURIComponent(input)}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-gray-800"
                        style={{ color: '#9ca3af', border: '1px solid #374151' }}
                    >
                        Search Mode
                    </button>
                    <button
                        onClick={() => { setMessages([]); setInput(''); }}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        style={{ color: '#9ca3af' }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 relative z-10 overflow-y-auto">
                {isEmpty ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-6 py-12">
                        <div className="relative mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                                <img src={logo} alt="Lanari AI" className="w-12 h-12 rounded-xl" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center" style={{ color: '#ffffff' }}>
                            Hi, I'm <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Lanari AI</span>
                        </h2>
                        <p className="text-base font-medium text-center max-w-md mb-10" style={{ color: '#9ca3af' }}>
                            Your intelligent assistant for everything Lanari Tech. Ask me anything about our products, services, or opportunities.
                        </p>

                        {/* Suggestion chips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(s.text)}
                                    className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                                    style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6b7280'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#374151'}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{s.icon}</span>
                                    <span className="text-sm font-semibold" style={{ color: '#d1d5db' }}>{s.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Messages */
                    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20 mt-1">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                        </svg>
                                    </div>
                                )}
                                <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                                    <div
                                        className={`px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                            ? 'rounded-br-md'
                                            : 'rounded-bl-md'
                                            }`}
                                        style={msg.role === 'user'
                                            ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#ffffff' }
                                            : { backgroundColor: '#1f2937', color: '#e5e7eb', border: '1px solid #374151' }
                                        }
                                    >
                                        {msg.role === 'ai' ? (
                                            <div className="space-y-2">
                                                {msg.content.split('\n').map((line, j) => {
                                                    if (!line.trim()) return <div key={j} className="h-2" />;
                                                    const formatted = line
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                                                        .replace(/^- /, '');
                                                    const isBullet = line.trim().startsWith('- ');
                                                    return (
                                                        <div key={j} className={`${isBullet ? 'flex items-start gap-2 pl-1' : ''}`}>
                                                            {isBullet && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />}
                                                            <span dangerouslySetInnerHTML={{ __html: formatted }} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                    {msg.link && (
                                        <button
                                            onClick={() => navigate(msg.link)}
                                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                            Visit page
                                        </button>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-1">
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                </div>
                                <div className="px-5 py-4 rounded-2xl rounded-bl-md" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="sticky bottom-0 z-40 px-4 pb-4 pt-2" style={{ background: 'linear-gradient(to top, #0a0e1a 60%, transparent)' }}>
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="flex items-end gap-3 rounded-2xl p-2" style={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Ask Lanari AI anything..."
                            rows={1}
                            className="flex-1 bg-transparent text-sm font-medium outline-none placeholder-gray-500 resize-none py-2.5 px-3 max-h-32"
                            style={{ color: '#ffffff' }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="p-2.5 rounded-xl transition-all flex-shrink-0 disabled:opacity-30"
                            style={{
                                background: input.trim() && !isTyping ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#374151',
                            }}
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-[11px] font-medium mt-2" style={{ color: '#4b5563' }}>
                        Lanari AI may not always be accurate. Verify important information.
                    </p>
                </form>
            </div>
        </div>
    );
}
