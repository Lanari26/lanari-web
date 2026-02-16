import React, { useState, useEffect } from 'react';
import { api } from './api';

const statusColors = {
    pending: { bg: 'rgba(234,179,8,0.15)', text: '#facc15' },
    reviewed: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
    accepted: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
    rejected: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
};

export default function Partners() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const load = () => {
        api.get('/partners')
            .then(res => setRequests(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const updateStatus = async (id, status) => {
        await api.patch(`/partners/${id}/status`, { status });
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500">{requests.length} partner requests</p>

            {requests.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-4xl mb-3">🤝</div>
                    <p className="text-gray-500 font-medium">No partner requests yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map(req => {
                        const sc = statusColors[req.status];
                        return (
                            <div
                                key={req.id}
                                className="rounded-2xl p-5 cursor-pointer transition-all"
                                style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                                onClick={() => setSelected(selected === req.id ? null : req.id)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-sm font-bold text-white">{req.organization_name}</span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: sc.bg, color: sc.text }}>
                                                {req.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-gray-500">{req.contact_email}</p>
                                        {selected !== req.id && (
                                            <p className="text-sm font-medium text-gray-400 truncate mt-1">{req.partnership_proposal}</p>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 flex-shrink-0">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                {selected === req.id && (
                                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid #374151' }}>
                                        <p className="text-sm text-gray-300 font-medium leading-relaxed whitespace-pre-wrap mb-4">{req.partnership_proposal}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-gray-600 mr-1">Set Status:</span>
                                            {['pending', 'reviewed', 'accepted', 'rejected'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={(e) => { e.stopPropagation(); updateStatus(req.id, s); }}
                                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${req.status === s ? 'ring-2 ring-offset-1 ring-offset-transparent' : 'opacity-60 hover:opacity-100'}`}
                                                    style={{ backgroundColor: statusColors[s].bg, color: statusColors[s].text, ...(req.status === s ? { ringColor: statusColors[s].text } : {}) }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                            <a
                                                href={`mailto:${req.contact_email}?subject=Re: Partnership with Lanari Tech`}
                                                onClick={e => e.stopPropagation()}
                                                className="ml-auto px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
                                            >
                                                Reply
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
