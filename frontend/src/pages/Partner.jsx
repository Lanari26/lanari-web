import { useState } from 'react';

const API = import.meta.env.VITE_API_URL;

export default function Partner() {
    const [form, setForm] = useState({ organizationName: '', contactEmail: '', partnershipProposal: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.organizationName.trim() || !form.contactEmail.trim() || !form.partnershipProposal.trim()) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/partners`, {
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
                        <div className="text-5xl mb-4">🤝</div>
                        <h2 className="text-2xl font-bold text-white mb-3">Proposal Submitted!</h2>
                        <p className="text-gray-400 mb-6">
                            Thank you for your interest in partnering with Lanari Tech. Our partnerships team will review your proposal and get back to you within 3-5 business days.
                        </p>
                        <button
                            onClick={() => { setSuccess(false); setForm({ organizationName: '', contactEmail: '', partnershipProposal: '' }); }}
                            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-bold hover:from-pink-500 hover:to-purple-500 transition-all"
                        >
                            Submit Another Proposal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6 text-white">Partner With Us</h1>
                <p className="text-xl text-gray-300 mb-12">
                    Together we can achieve more. We are looking for strategic partners to expand our reach and impact across Africa.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left mb-16">
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <h3 className="text-2xl font-bold text-pink-400 mb-4">For Educational Institutions</h3>
                        <p className="text-gray-400 mb-6">Integrate our Academy curriculum into your school and give your students a head start in the digital economy.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <h3 className="text-2xl font-bold text-pink-400 mb-4">For Businesses</h3>
                        <p className="text-gray-400 mb-6">Leverage our Rise Network and AI solutions to optimize your operations and find top talent.</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Become a Partner</h2>
                    {error && (
                        <div className="max-w-md mx-auto mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                        <input
                            type="text"
                            placeholder="Organization Name"
                            value={form.organizationName}
                            onChange={e => setForm({ ...form, organizationName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Contact Email"
                            value={form.contactEmail}
                            onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                        />
                        <textarea
                            placeholder="Partnership Proposal"
                            value={form.partnershipProposal}
                            onChange={e => setForm({ ...form, partnershipProposal: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none h-32 resize-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold hover:from-pink-500 hover:to-purple-500 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Proposal'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
