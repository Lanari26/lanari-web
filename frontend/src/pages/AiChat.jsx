import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';

const API = import.meta.env.VITE_API_URL;

const suggestions = [
    { text: 'What is Siri Market?', icon: '🛍️' },
    { text: 'How can I learn coding?', icon: '🎓' },
    { text: 'Find me a freelance job', icon: '🚀' },
    { text: 'Tell me about cloud services', icon: '☁️' },
];

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

export default function AiChat() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const hasSentInitial = useRef(false);

    const token = getToken();
    const user = getUser();

    const authHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleUserClick = () => {
        navigate('/dashboard');
    };

    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    // Load sessions on mount
    useEffect(() => {
        if (token) loadSessions();
    }, []);

    // Auto-send initial query from search params
    useEffect(() => {
        if (token && initialQuery.trim() && !hasSentInitial.current) {
            hasSentInitial.current = true;
            sendMessage(initialQuery);
        }
    }, []);

    const loadSessions = async () => {
        setLoadingSessions(true);
        try {
            const res = await fetch(`${API}/ai/sessions`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) setSessions(data.data);
        } catch (e) {
            console.error('Failed to load sessions:', e);
        }
        setLoadingSessions(false);
    };

    const loadSession = async (id) => {
        try {
            const res = await fetch(`${API}/ai/sessions/${id}`, { headers: authHeaders() });
            const data = await res.json();
            if (data.success) {
                setCurrentSessionId(data.data.session.id);
                setMessages(data.data.messages.map(m => ({
                    role: m.role, content: m.content, link: m.link
                })));
                setSidebarOpen(false);
            }
        } catch (e) {
            console.error('Failed to load session:', e);
        }
    };

    const deleteSession = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${API}/ai/sessions/${id}`, {
                method: 'DELETE', headers: authHeaders()
            });
            const data = await res.json();
            if (data.success) {
                setSessions(prev => prev.filter(s => s.id !== id));
                if (currentSessionId === id) startNewChat();
            }
        } catch (e) {
            console.error('Failed to delete session:', e);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([]);
        setInput('');
        setSidebarOpen(false);
    };

    const sendMessage = async (text) => {
        const userMsg = text || input;
        if (!userMsg.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: userMsg.trim() }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch(`${API}/ai/chat`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ message: userMsg.trim(), sessionId: currentSessionId })
            });
            const data = await res.json();
            if (data.success) {
                if (!currentSessionId) setCurrentSessionId(data.sessionId);
                setMessages(prev => [...prev, { role: 'ai', content: data.data.text, link: data.data.link }]);
                loadSessions();
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, something went wrong. Please try again.', link: null }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Unable to connect to the server. Please try again later.', link: null }]);
        }

        setIsTyping(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const isEmpty = messages.length === 0 && !isTyping;

    // Not logged in — show login prompt
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0e1a' }}>
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-[600px] h-[600px] rounded-full blur-3xl top-1/4 left-1/4" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)' }} />
                    <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)' }} />
                </div>
                <div className="relative z-10 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30 mx-auto mb-8">
                        <img src={logo} alt="Lanari AI" className="w-12 h-12 rounded-xl" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3" style={{ color: '#ffffff' }}>
                        Sign in to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Lanari AI</span>
                    </h2>
                    <p className="text-base font-medium mb-8" style={{ color: '#9ca3af' }}>
                        Log in to chat with our AI assistant and keep your conversation history.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3 rounded-2xl text-base font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full py-3 rounded-2xl text-base font-bold transition-all hover:scale-[1.02]"
                            style={{ backgroundColor: '#1f2937', color: '#d1d5db', border: '1px solid #374151' }}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}

            {/* Session Sidebar */}
            <div
                className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{ width: '280px', backgroundColor: '#111827', borderRight: '1px solid #1f2937' }}
            >
                {/* Sidebar header */}
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1f2937' }}>
                    <h2 className="text-sm font-bold" style={{ color: '#e5e7eb' }}>Chat History</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={startNewChat}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            style={{ color: '#9ca3af' }}
                            title="New Chat"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
                            style={{ color: '#9ca3af' }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* New Chat button */}
                <div className="p-3">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#ffffff' }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        New Chat
                    </button>
                </div>

                {/* Sessions list */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
                    {loadingSessions ? (
                        <div className="text-center py-8">
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <p className="text-center text-xs font-medium py-8" style={{ color: '#6b7280' }}>
                            No chat history yet. Start a new conversation!
                        </p>
                    ) : (
                        sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => loadSession(session.id)}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id ? '' : 'hover:bg-gray-800/50'}`}
                                style={currentSessionId === session.id ? { backgroundColor: '#1f2937', border: '1px solid #374151' } : { border: '1px solid transparent' }}
                            >
                                <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#6b7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate" style={{ color: '#d1d5db' }}>{session.title}</p>
                                    <p className="text-[10px] font-medium" style={{ color: '#6b7280' }}>
                                        {session.message_count} message{session.message_count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => deleteSession(session.id, e)}
                                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                                    style={{ color: '#ef4444' }}
                                    title="Delete session"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* User info at bottom */}
                <div
                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ borderTop: '1px solid #1f2937' }}
                    onClick={handleUserClick}
                    title="Open your dashboard"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: '#d1d5db' }}>{user?.name || 'User'}</p>
                        <p className="text-[10px] font-medium truncate" style={{ color: '#6b7280' }}>{user?.email || ''}</p>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-[600px] h-[600px] rounded-full blur-3xl top-1/4 left-1/4" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)' }} />
                    <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)' }} />
                </div>

                {/* Top bar */}
                <div className="sticky top-0 z-40 backdrop-blur-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(10, 14, 26, 0.9)', borderBottom: '1px solid rgba(75, 85, 99, 0.3)' }}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
                            style={{ color: '#9ca3af' }}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
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
                            onClick={startNewChat}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            style={{ color: '#9ca3af' }}
                            title="New Chat"
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
                                    <div className={`max-w-[80%]`}>
                                        <div
                                            className={`px-5 py-3.5 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
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
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                            ))}

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
                            Lanari AI is trained from curated data. Verify important information.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
