import React, { useState, useEffect } from 'react';
import { api } from './api';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('jobs');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', department: '', type: 'Full-time', location: '', description: '' });
    const [editId, setEditId] = useState(null);

    const load = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/careers/jobs'),
                api.get('/careers/applications')
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
        } catch (err) {}
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => {
        setForm({ title: '', department: '', type: 'Full-time', location: '', description: '' });
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/careers/jobs/${editId}`, form);
        } else {
            await api.post('/careers/jobs', form);
        }
        resetForm();
        load();
    };

    const startEdit = (job) => {
        setForm({ title: job.title, department: job.department, type: job.type, location: job.location, description: job.description || '' });
        setEditId(job.id);
        setShowForm(true);
    };

    const deleteJob = async (id) => {
        await api.del(`/careers/jobs/${id}`);
        load();
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
                {[
                    { key: 'jobs', label: `Jobs (${jobs.length})` },
                    { key: 'applications', label: `Applications (${applications.length})` },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'bg-blue-500/15 text-blue-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {t.label}
                    </button>
                ))}
                {tab === 'jobs' && (
                    <button
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className="ml-auto px-4 py-2 rounded-xl text-sm font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
                    >
                        {showForm ? 'Cancel' : '+ New Job'}
                    </button>
                )}
            </div>

            {/* Job Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Job Title" required className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500" />
                        <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Department" required className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500" />
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500">
                            {['Full-time', 'Part-time', 'Internship', 'Contract'].map(t => <option key={t}>{t}</option>)}
                        </select>
                        <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" required className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500" />
                    </div>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Job description (optional)" rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500 resize-none" />
                    <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all">
                        {editId ? 'Update Job' : 'Create Job'}
                    </button>
                </form>
            )}

            {/* Jobs List */}
            {tab === 'jobs' && (
                <div className="space-y-3">
                    {jobs.length === 0 ? (
                        <div className="text-center py-16"><div className="text-4xl mb-3">💼</div><p className="text-gray-500 font-medium">No job listings</p></div>
                    ) : jobs.map(job => (
                        <div key={job.id} className="flex items-center gap-4 rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-sm font-bold text-white">{job.title}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-400" style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}>{job.type}</span>
                                </div>
                                <p className="text-xs font-medium text-gray-500">{job.department} &middot; {job.location}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => startEdit(job)} className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-500 hover:text-blue-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => deleteJob(job.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-500 hover:text-red-400">
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
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="text-sm font-bold text-white">{app.applicant_name}</span>
                                        <span className="text-xs font-medium text-gray-600">&rarr;</span>
                                        <span className="text-xs font-bold text-purple-400">{app.job_title}</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 mb-2">{app.applicant_email} &middot; {app.department}</p>
                                    {app.cover_letter && (
                                        <p className="text-sm font-medium text-gray-400 leading-relaxed">{app.cover_letter}</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#facc15' }}>
                                        {app.status}
                                    </span>
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
