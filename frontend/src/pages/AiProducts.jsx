import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AiProducts() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <div className="inline-block px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 font-bold text-sm mb-6 border border-orange-500/20">
                            ARTIFICIAL INTELLIGENCE
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-white">
                            Intelligent Solutions
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            We harness the power of AI to solve complex problems. From automated business tools to smart assistants, we are building the intelligent infrastructure of the future.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/coming-soon')} className="px-8 py-4 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-500 transition-colors">
                                Explore Solutions
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 aspect-square flex items-center justify-center">
                            <span className="text-9xl">🤖</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-32">
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-bold text-white">For Business</h2>
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-3xl bg-gray-800/20 border border-gray-700 hover:border-orange-500/30 transition-colors">
                                <span className="text-4xl mb-4 block">💬</span>
                                <h3 className="text-xl font-bold text-white mb-2">Customer Support AI</h3>
                                <p className="text-gray-400">Automate 24/7 customer interactions with natural language understanding.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-gray-800/20 border border-gray-700 hover:border-orange-500/30 transition-colors">
                                <span className="text-4xl mb-4 block">📊</span>
                                <h3 className="text-xl font-bold text-white mb-2">Predictive Analytics</h3>
                                <p className="text-gray-400">Forecast trends and make data-driven decisions with high accuracy models.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-gray-800/20 border border-gray-700 hover:border-orange-500/30 transition-colors">
                                <span className="text-4xl mb-4 block">📝</span>
                                <h3 className="text-xl font-bold text-white mb-2">Auto-Documentation</h3>
                                <p className="text-gray-400">Automatically generate reports, summaries, and documentation from raw data.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
