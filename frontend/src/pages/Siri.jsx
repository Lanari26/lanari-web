import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Siri() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm mb-6 border border-blue-500/20">
                            E-COMMERCE REVOLUTION
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-white">
                            Siri Market
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            The future of retail is here. Become a trader anywhere even without owning stock. Buy goods online and resell them effortlessly, empowering anyone to start a business from their phone.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/coming-soon')} className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors">
                                Start Selling
                            </button>
                            <button onClick={() => navigate('/coming-soon')} className="px-8 py-4 rounded-full border border-gray-600 text-white font-bold hover:bg-gray-800 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 aspect-square flex items-center justify-center">
                            <span className="text-9xl">🛍️</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl mb-6">📦</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Zero Inventory</h3>
                        <p className="text-gray-400">
                            Start your business with zero capital. We handle the stock, warehousing, and logistics. You focus on selling.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl mb-6">🌍</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Global Reach</h3>
                        <p className="text-gray-400">
                            Access products from global markets and sell to customers anywhere. Breaking down geographical barriers.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl mb-6">💸</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Instant Profits</h3>
                        <p className="text-gray-400">
                            Set your own margins and earn instantly. Track your sales and withdraw your earnings whenever you want.
                        </p>
                    </div>
                </div>

                <div className="text-center rounded-3xl bg-gradient-to-r from-blue-900/50 to-cyan-900/50 p-16 border border-blue-500/30">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your financial future?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of smart traders on Siri Market today.
                    </p>
                    <button onClick={() => navigate('/coming-soon')} className="px-10 py-4 rounded-full bg-white text-blue-900 font-bold hover:shadow-lg hover:scale-105 transition-all">
                        Download App
                    </button>
                </div>
            </div>
        </div>
    );
}
