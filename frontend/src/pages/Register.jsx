import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
        } catch {
            setError('Unable to connect to server');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-24 px-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join Lanari Tech today</p>
                </div>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input type="text" value={form.fullName} onChange={update('fullName')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input type="email" value={form.email} onChange={update('email')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="name@company.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                        <input type="tel" value={form.phoneNumber} onChange={update('phoneNumber')} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="+250 700 000 000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input type="password" value={form.password} onChange={update('password')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                        <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400">
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-white font-bold hover:underline">Sign In</a>
                </div>
            </div>
        </div>
    );
}
