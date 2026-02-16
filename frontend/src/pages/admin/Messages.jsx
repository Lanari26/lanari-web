import React, { useState, useEffect } from 'react';
import { api } from './api';

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const load = () => {
        api.get('/contact')
            .then(res => setMessages(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const markRead = async (id) => {
        await api.patch(`/contact/${id}/read`);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: 1 } : m));
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{messages.length} total messages</p>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-gray-500 font-medium">No messages yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className="rounded-2xl p-5 transition-all cursor-pointer"
                            style={{ backgroundColor: '#1f2937', border: `1px solid ${msg.is_read ? '#374151' : '#3b82f6'}` }}
                            onClick={() => { setSelected(selected === msg.id ? null : msg.id); if (!msg.is_read) markRead(msg.id); }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {!msg.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                                        <span className="text-sm font-bold text-white">{msg.first_name} {msg.last_name}</span>
                                        <span className="text-xs font-medium text-gray-600">{msg.email}</span>
                                    </div>
                                    <p className={`text-sm font-medium ${selected === msg.id ? 'text-gray-300' : 'text-gray-400 truncate'}`}>
                                        {msg.message}
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-gray-600 flex-shrink-0">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {selected === msg.id && (
                                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #374151' }}>
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                        <div>
                                            <span className="text-gray-600 font-medium">Name: </span>
                                            <span className="text-gray-300 font-semibold">{msg.first_name} {msg.last_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">Email: </span>
                                            <span className="text-blue-400 font-semibold">{msg.email}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                    <div className="mt-3">
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your message to Lanari Tech`}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9 6 9-6M3 10v8a2 2 0 002 2h14a2 2 0 002-2v-8" />
                                            </svg>
                                            Reply via Email
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
