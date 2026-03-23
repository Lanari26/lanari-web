import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function Internships() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyInternship, setApplyInternship] = useState(null);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', university: '', fieldOfStudy: '', yearOfStudy: '', motivation: '', portfolioUrl: '' });
    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored) {
                const user = JSON.parse(stored);
                setForm(f => ({ ...f, fullName: user.fullName || '', email: user.email || '' }));
            }
        } catch {}

        fetch(`${API}/internships`)
            .then(res => res.json())
            .then(data => { if (data.success) setInternships(data.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const openApply = (internship) => {
        setApplyInternship(internship);
        setStatus(null);
        setErrorMsg('');
    };

    const closeApply = () => {
        setApplyInternship(null);
        setStatus(null);
        setErrorMsg('');
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch(`${API}/internships/${applyInternship.id}/apply`, {
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

    const deptColors = {
        'Engineering': 'bg-blue-500/15 text-blue-400',
        'Research': 'bg-emerald-500/15 text-emerald-400',
        'Design': 'bg-pink-500/15 text-pink-400',
        'Marketing': 'bg-orange-500/15 text-orange-400',
    };

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 font-bold text-sm mb-6 border border-purple-500/20">
                        ACADEMIC INTERNSHIPS
                    </div>
                    <h1 className="text-5xl font-bold mb-6 text-white">Grow With Us</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Launch your career with a hands-on internship at Lanari Tech. Gain real-world experience, mentorship, and the skills to stand out in the tech industry.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        { title: 'Hands-on Experience', desc: 'Work on real projects that impact thousands of users across Africa.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                        { title: 'Mentorship', desc: 'Learn directly from experienced engineers, designers, and marketers.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                        { title: 'Career Growth', desc: 'Top interns get offers to join our team full-time after the program.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                    ].map((b, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                            <p className="text-gray-400 text-sm">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Internship Listings */}
                <h2 className="text-2xl font-bold text-white mb-6">Open Internships</h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : internships.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-1">No open internships right now</p>
                        <p className="text-gray-600 text-sm">Check back soon or contact us directly.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {internships.map((intern) => (
                            <div key={intern.id} className="group p-8 rounded-2xl bg-gray-800/40 border border-gray-700 hover:border-purple-500/50 transition-all hover:bg-gray-800/60">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{intern.title}</h3>
                                        <div className="flex flex-wrap gap-3 text-sm font-medium mb-3">
                                            <span className={`px-3 py-1 rounded-full ${deptColors[intern.department] || 'bg-gray-700 text-gray-300'}`}>{intern.department}</span>
                                            <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400">{intern.duration}</span>
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {intern.location}
                                            </span>
                                        </div>
                                        {intern.description && (
                                            <p className="text-gray-500 text-sm leading-relaxed mb-2">{intern.description}</p>
                                        )}
                                        {intern.requirements && (
                                            <p className="text-gray-600 text-xs leading-relaxed"><strong className="text-gray-500">Requirements:</strong> {intern.requirements}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => openApply(intern)}
                                        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all w-full md:w-auto flex-shrink-0"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-20 text-center p-12 rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-gray-700">
                    <h2 className="text-3xl font-bold text-white mb-4">Don't see the right internship?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        We're always open to hearing from talented students. Send us your CV and tell us what you're passionate about.
                    </p>
                    <a href="mailto:lanari.rw@gmail.com" className="inline-block px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition-all">
                        Email Us
                    </a>
                </div>
            </div>

            {/* Apply Modal */}
            {applyInternship && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeApply}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        onClick={(e) => e.stopPropagation()}
                    >
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
                                    Thank you for applying to <strong className="text-white">{applyInternship.title}</strong>. We've sent a confirmation to your email and will review your application soon.
                                </p>
                                <button onClick={closeApply} className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">Apply for Internship</h2>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <span className="text-purple-400 font-bold text-sm">{applyInternship.title}</span>
                                        <span className="text-gray-600">-</span>
                                        <span className="text-gray-500 text-sm">{applyInternship.department}</span>
                                        <span className="text-gray-600">-</span>
                                        <span className="text-gray-500 text-sm">{applyInternship.duration}</span>
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                                        {errorMsg}
                                    </div>
                                )}

                                <form onSubmit={handleApply} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name *</label>
                                            <input type="text" value={form.fullName} onChange={update('fullName')} required className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email *</label>
                                            <input type="email" value={form.email} onChange={update('email')} required className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Phone</label>
                                            <input type="tel" value={form.phone} onChange={update('phone')} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all" placeholder="+250 7XX XXX XXX" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">University</label>
                                            <input type="text" value={form.university} onChange={update('university')} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all" placeholder="University of Rwanda" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Field of Study</label>
                                            <input type="text" value={form.fieldOfStudy} onChange={update('fieldOfStudy')} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all" placeholder="Computer Science" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Year of Study</label>
                                            <select value={form.yearOfStudy} onChange={update('yearOfStudy')} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all">
                                                <option value="">Select year</option>
                                                <option value="Year 1">Year 1</option>
                                                <option value="Year 2">Year 2</option>
                                                <option value="Year 3">Year 3</option>
                                                <option value="Year 4">Year 4</option>
                                                <option value="Year 5+">Year 5+</option>
                                                <option value="Graduate">Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Portfolio URL</label>
                                        <input type="url" value={form.portfolioUrl} onChange={update('portfolioUrl')} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all" placeholder="https://github.com/yourprofile" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Motivation Letter</label>
                                        <textarea value={form.motivation} onChange={update('motivation')} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white text-sm transition-all resize-none" placeholder="Tell us why you're interested in this internship and what you hope to learn..." />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
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
