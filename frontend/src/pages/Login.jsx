import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch {
            setError('Unable to connect to server');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-24 px-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to access your Lanari account</p>
                </div>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="name@company.com" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot?</a>
                        </div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400">
                    Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="text-white font-bold hover:underline">Sign Up</a>
                </div>
            </div>
        </div>
    );
}
