import React, { useState } from 'react';

export default function Contact() {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
    const [status, setStatus] = useState(null);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    // There is no form backend: hand the message to the visitor's mail app, addressed to us.
    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Message from ${form.firstName} ${form.lastName}`);
        const body = encodeURIComponent(`${form.message}\n\n${form.firstName} ${form.lastName}\n${form.email}`);
        window.location.assign(`mailto:info@lanari.rw?subject=${subject}&body=${body}`);
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h1 className="text-5xl font-bold mb-6 text-white">Get in Touch</h1>
                    <p className="text-xl text-gray-400 mb-12">
                        A question about Satellite, Satellite Host, Model Training, Intore or Isiri? Tell us what you need and we will reply.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Email Us</h3>
                                <p className="text-gray-400">info@lanari.rw</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Call Us</h3>
                                <p className="text-gray-400">+250 795 983 610</p>
                                <p className="text-gray-400">+250 791 724 884</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Visit Us</h3>
                                <p className="text-gray-400">Norrsken House Kigali</p>
                                <p className="text-gray-400">1 KN 78 St, Kigali, Rwanda</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-gray-800 border border-gray-700">
                    {status === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-gray-400 mb-6">Your mail app should have opened with the message ready to send to info@lanari.rw. If it did not, write to us at info@lanari.rw.</p>
                            <button
                                onClick={() => setStatus(null)}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300">First Name</label>
                                    <input type="text" value={form.firstName} onChange={update('firstName')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white transition-all" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300">Last Name</label>
                                    <input type="text" value={form.lastName} onChange={update('lastName')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white transition-all" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300">Email Address</label>
                                <input type="email" value={form.email} onChange={update('email')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white transition-all" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea value={form.message} onChange={update('message')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white h-32 transition-all" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-1">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
