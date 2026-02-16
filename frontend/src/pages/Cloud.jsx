import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cloud() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <div className="inline-block px-4 py-2 rounded-full bg-sky-500/10 text-sky-400 font-bold text-sm mb-6 border border-sky-500/20">
                    CLOUD INFRASTRUCTURE
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-white">
                    Lanari Cloud
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
                    Secure, scalable, and reliable cloud hosting solutions built for African businesses. Deploy your applications with ease and confidence.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700 hover:border-sky-500/50 transition-all">
                        <div className="text-4xl mb-4">☁️</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Web Hosting</h3>
                        <p className="text-gray-400">High-performance hosting for websites and web applications.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700 hover:border-sky-500/50 transition-all">
                        <div className="text-4xl mb-4">🗄️</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Object Storage</h3>
                        <p className="text-gray-400">Scalable storage for your images, videos, and backups.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700 hover:border-sky-500/50 transition-all">
                        <div className="text-4xl mb-4">🔄</div>
                        <h3 className="text-2xl font-bold text-white mb-2">CDN</h3>
                        <p className="text-gray-400">Deliver content faster to your users with our global network.</p>
                    </div>
                </div>

                <div className="mt-16">
                    <button onClick={() => navigate('/coming-soon')} className="px-8 py-4 rounded-full bg-sky-600 text-white font-bold hover:bg-sky-500 transition-colors">
                        Start Free Trial
                    </button>
                </div>
            </div>
        </div>
    );
}
