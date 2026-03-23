import React, { useState, useEffect } from 'react';
import { api } from './api';

const statusColors = {
    received: { bg: 'rgba(234,179,8,0.15)', color: '#facc15' },
    reviewing: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    interview: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
    accepted: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
    rejected: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};

export default function Internships() {
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('internships');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', department: '', duration: '', location: '', description: '', requirements: '' });
    const [editId, setEditId] = useState(null);
    const [expandedApp, setExpandedApp] = useState(null);

    const load = async () => {
        try {
            const [intRes, appsRes] = await Promise.all([
                api.get('/internships/admin/all'),
                api.get('/internships/admin/applications')
            ]);
            setInternships(intRes.data);
            setApplications(appsRes.data);
        } catch (err) {}
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => {
        setForm({ title: '', department: '', duration: '', location: '', description: '', requirements: '' });
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/internships/${editId}`, form);
        } else {
            await api.post('/internships', form);
        }
        resetForm();
        load();
    };

    const startEdit = (intern) => {
        setForm({
            title: intern.title,
            department: intern.department,
            duration: intern.duration,
            location: intern.location,
            description: intern.description || '',
            requirements: intern.requirements || ''
        });
        setEditId(intern.id);
        setShowForm(true);
    };

    const deleteInternship = async (id) => {
        await api.del(`/internships/${id}`);
        load();
    };

    const updateStatus = async (appId, status) => {
        await api.patch(`/internships/admin/applications/${appId}/status`, { status });
        load();
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
                {[
                    { key: 'internships', label: `Internships (${internships.length})` },
                    { key: 'applications', label: `Applications (${applications.length})` },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'bg-purple-500/15 text-purple-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {t.label}
                    </button>
                ))}
                {tab === 'internships' && (
                    <button
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className="ml-auto px-4 py-2 rounded-xl text-sm font-bold bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-colors"
                    >
                        {showForm ? 'Cancel' : '+ New Internship'}
                    </button>
                )}
            </div>

            {/* Internship Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Internship Title" required className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-500" />
                        <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Department" required className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-500" />
                        <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g. 3 months)" required className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-500" />
                        <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" required className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-500" />
                    </div>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-500 resize-none" />
                    <textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} placeholder="Requirements (optional)" rows={2} className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-500 resize-none" />
                    <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transition-all">
                        {editId ? 'Update Internship' : 'Create Internship'}
                    </button>
                </form>
            )}

            {/* Internships List */}
            {tab === 'internships' && (
                <div className="space-y-3">
                    {internships.length === 0 ? (
                        <div className="text-center py-16"><div className="text-4xl mb-3">🎓</div><p className="text-gray-500 font-medium">No internship listings</p></div>
                    ) : internships.map(intern => (
                        <div key={intern.id} className="flex items-center gap-4 rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-sm font-bold text-white">{intern.title}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-purple-400" style={{ backgroundColor: 'rgba(168,85,247,0.15)' }}>{intern.duration}</span>
                                    {!intern.is_active && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-red-400" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>Inactive</span>
                                    )}
                                </div>
                                <p className="text-xs font-medium text-gray-500">{intern.department} &middot; {intern.location}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => startEdit(intern)} className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-500 hover:text-purple-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => deleteInternship(intern.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-500 hover:text-red-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Applications List */}
            {tab === 'applications' && (
                <div className="space-y-3">
                    {applications.length === 0 ? (
                        <div className="text-center py-16"><div className="text-4xl mb-3">📄</div><p className="text-gray-500 font-medium">No applications yet</p></div>
                    ) : applications.map(app => (
                        <div key={app.id} className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="text-sm font-bold text-white">{app.full_name}</span>
                                        <span className="text-xs font-medium text-gray-600">&rarr;</span>
                                        <span className="text-xs font-bold text-purple-400">{app.internship_title}</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">
                                        {app.email} &middot; {app.department}
                                        {app.university && <> &middot; {app.university}</>}
                                        {app.field_of_study && <> &middot; {app.field_of_study}</>}
                                        {app.year_of_study && <> &middot; {app.year_of_study}</>}
                                    </p>
                                    {app.phone && <p className="text-xs text-gray-600 mb-1">Phone: {app.phone}</p>}
                                    {app.portfolio_url && (
                                        <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mb-1 inline-block">
                                            Portfolio &rarr;
                                        </a>
                                    )}

                                    {expandedApp === app.id ? (
                                        <div className="mt-2">
                                            {app.motivation && (
                                                <div className="p-3 rounded-xl bg-gray-800 border border-gray-700 mb-2">
                                                    <p className="text-xs font-bold text-gray-400 mb-1">Motivation</p>
                                                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{app.motivation}</p>
                                                </div>
                                            )}
                                            <button onClick={() => setExpandedApp(null)} className="text-xs text-gray-600 hover:text-gray-400">Hide details</button>
                                        </div>
                                    ) : (
                                        (app.motivation) && (
                                            <button onClick={() => setExpandedApp(app.id)} className="text-xs text-purple-400 hover:text-purple-300 mt-1">
                                                View details
                                            </button>
                                        )
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <select
                                        value={app.status}
                                        onChange={(e) => updateStatus(app.id, e.target.value)}
                                        className="px-2 py-1 rounded-lg text-[11px] font-bold uppercase border-0 outline-none cursor-pointer"
                                        style={{ backgroundColor: statusColors[app.status]?.bg, color: statusColors[app.status]?.color }}
                                    >
                                        {['received', 'reviewing', 'interview', 'accepted', 'rejected'].map(s => (
                                            <option key={s} value={s} style={{ backgroundColor: '#1f2937', color: '#e5e7eb' }}>{s}</option>
                                        ))}
                                    </select>
                                    <span className="text-xs font-medium text-gray-600">{new Date(app.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
