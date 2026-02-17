import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function Careers() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyJob, setApplyJob] = useState(null);
    const [form, setForm] = useState({ applicantName: '', applicantEmail: '', coverLetter: '' });
    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Pre-fill from localStorage if user is logged in
        try {
            const stored = localStorage.getItem('user');
            if (stored) {
                const user = JSON.parse(stored);
                setForm(f => ({ ...f, applicantName: user.fullName || '', applicantEmail: user.email || '' }));
            }
        } catch {}

        fetch(`${API}/careers/jobs`)
            .then(res => res.json())
            .then(data => { if (data.success) setJobs(data.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const openApply = (job) => {
        setApplyJob(job);
        setStatus(null);
        setErrorMsg('');
    };

    const closeApply = () => {
        setApplyJob(null);
        setStatus(null);
        setErrorMsg('');
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch(`${API}/careers/jobs/${applyJob.id}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || 'Application failed');
                setStatus('error');
                return;
            }

            setStatus('success');
        } catch {
            setErrorMsg('Unable to connect to server');
            setStatus('error');
        }
    };

    const typeColors = {
        'Full-time': 'bg-emerald-500/15 text-emerald-400',
        'Part-time': 'bg-blue-500/15 text-blue-400',
        'Internship': 'bg-purple-500/15 text-purple-400',
        'Contract': 'bg-orange-500/15 text-orange-400',
    };

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-white">Join Our Team</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Be part of a team that is redefining the future of technology in Africa. We are looking for passionate, curious, and driven individuals.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-1">No open positions right now</p>
                        <p className="text-gray-600 text-sm">Check back soon or send us your CV directly.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div key={job.id} className="group p-8 rounded-2xl bg-gray-800/40 border border-gray-700 hover:border-blue-500/50 transition-all hover:bg-gray-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm font-medium mb-3">
                                        <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300">{job.department}</span>
                                        <span className={`px-3 py-1 rounded-full ${typeColors[job.type] || 'bg-gray-700 text-gray-300'}`}>{job.type}</span>
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                        </span>
                                    </div>
                                    {job.description && (
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{job.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => openApply(job)}
                                    className="px-6 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-blue-50 transition-colors w-full md:w-auto flex-shrink-0"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-20 text-center p-12 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-gray-700">
                    <h2 className="text-3xl font-bold text-white mb-4">Don't see the right fit?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        We are always on the lookout for talent. Send us your CV and tell us how you can make a difference at Lanari Tech.
                    </p>
                    <a href="mailto:lanari.rw@gmail.com" className="inline-block px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition-all">
                        Email Us
                    </a>
                </div>
            </div>

            {/* Apply Modal */}
            {applyJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeApply}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button onClick={closeApply} className="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {status === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                                <p className="text-gray-400 mb-6">
                                    Thank you for applying to <strong className="text-white">{applyJob.title}</strong>. We've sent a confirmation to your email and will review your application soon.
                                </p>
                                <button onClick={closeApply} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Job info */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">Apply for Position</h2>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <span className="text-blue-400 font-bold text-sm">{applyJob.title}</span>
                                        <span className="text-gray-600">-</span>
                                        <span className="text-gray-500 text-sm">{applyJob.department}</span>
                                        <span className="text-gray-600">-</span>
                                        <span className="text-gray-500 text-sm">{applyJob.location}</span>
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                                        {errorMsg}
                                    </div>
                                )}

                                <form onSubmit={handleApply} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={form.applicantName}
                                            onChange={update('applicantName')}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={form.applicantEmail}
                                            onChange={update('applicantEmail')}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Cover Letter <span className="text-gray-600 font-normal">(optional)</span></label>
                                        <textarea
                                            value={form.coverLetter}
                                            onChange={update('coverLetter')}
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all resize-none"
                                            placeholder="Tell us why you'd be a great fit for this role..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {status === 'sending' ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
