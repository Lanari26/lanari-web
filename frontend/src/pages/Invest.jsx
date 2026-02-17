import { useState } from 'react';

const API = import.meta.env.VITE_API_URL;

const RANGES = ['$5K-$25K', '$25K-$100K', '$100K-$500K', '$500K+'];

export default function Invest() {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', organization: '', investmentRange: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName.trim() || !form.email.trim()) {
            setError('Name and email are required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/investors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (e) {
            setError('Network error. Please try again.');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen py-24 px-6">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-3xl p-10">
                        <div className="text-5xl mb-4">💎</div>
                        <h2 className="text-2xl font-bold text-white mb-3">Inquiry Submitted!</h2>
                        <p className="text-gray-400 mb-2">
                            Thank you for your interest in investing in Lanari Tech.
                        </p>
                        <p className="text-gray-400 mb-6">
                            Our investor relations team will reach out to you within 2-3 business days with our pitch deck and more details.
                        </p>
                        <p className="text-amber-400 text-sm font-semibold mb-6">A confirmation email has been sent to your inbox.</p>
                        <button
                            onClick={() => { setSuccess(false); setForm({ fullName: '', email: '', phone: '', organization: '', investmentRange: '', message: '' }); }}
                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-xl text-white font-bold hover:from-amber-500 hover:to-yellow-400 transition-all"
                        >
                            Submit Another Inquiry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="text-6xl mb-6 block">💎</span>
                    <h1 className="text-5xl font-bold mb-6 text-white">Invest in the Future</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Lanari Tech is building the digital infrastructure for the next generation of African businesses. Be a part of our growth story.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-16">
                    {[
                        { value: '4+', label: 'Core Platforms' },
                        { value: 'High', label: 'Growth Potential' },
                        { value: 'Rwanda', label: 'Based HQ' },
                        { value: 'Africa', label: 'Target Market' },
                    ].map((stat) => (
                        <div key={stat.label} className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700 text-center">
                            <div className="text-2xl font-bold text-amber-400 mb-1">{stat.value}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Why Invest */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <h3 className="text-xl font-bold text-amber-400 mb-4">Diversified Ecosystem</h3>
                        <p className="text-gray-400 leading-relaxed">
                            From e-commerce (Siri) to freelancing (Rise), digital education (Academy), and AI solutions — Lanari Tech operates across multiple high-growth verticals in the African market.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <h3 className="text-xl font-bold text-amber-400 mb-4">Strategic Position</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Headquartered at Norrsken House Kigali, we're at the heart of Africa's fastest-growing innovation hub with access to talent, partnerships, and a supportive regulatory environment.
                        </p>
                    </div>
                </div>

                {/* Investment Inquiry Form */}
                <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Investment Inquiry</h2>
                    <p className="text-gray-400 mb-6">Fill out the form below and our investor relations team will get in touch with you.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                            <input
                                type="email"
                                placeholder="Email Address *"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Organization / Fund Name"
                                value={form.organization}
                                onChange={e => setForm({ ...form, organization: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                            />
                        </div>

                        {/* Investment Range */}
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Investment Range</label>
                            <div className="flex flex-wrap gap-3">
                                {RANGES.map(range => (
                                    <button
                                        key={range}
                                        type="button"
                                        onClick={() => setForm({ ...form, investmentRange: form.investmentRange === range ? '' : range })}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                                            form.investmentRange === range
                                                ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                                                : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-gray-500'
                                        }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            placeholder="Tell us about your investment interest or questions (optional)"
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none h-28 resize-none"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-bold hover:from-amber-500 hover:to-yellow-400 transition-all disabled:opacity-50 text-lg"
                        >
                            {loading ? 'Submitting...' : 'Submit Investment Inquiry'}
                        </button>

                        <p className="text-center text-gray-500 text-xs">
                            Your information is kept confidential and will only be used by our investor relations team.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
