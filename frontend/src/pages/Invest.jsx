import React from 'react';

export default function Invest() {
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <span className="text-6xl mb-6 block">💎</span>
                <h1 className="text-5xl font-bold mb-6 text-white">Invest in the Future</h1>
                <p className="text-xl text-gray-300 mb-12">
                    Lanari Tech is building the digital infrastructure for the next generation of African businesses. Be a part of our growth story.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700">
                        <div className="text-3xl font-bold text-amber-400 mb-2">4+</div>
                        <div className="text-gray-400">Core Platforms</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700">
                        <div className="text-3xl font-bold text-amber-400 mb-2">High</div>
                        <div className="text-gray-400">Growth Potential</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700">
                        <div className="text-3xl font-bold text-amber-400 mb-2">Rwanda</div>
                        <div className="text-gray-400">Based HQ</div>
                    </div>
                </div>

                <div className="text-left bg-gray-900 border border-gray-800 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Request Investor Deck</h2>
                    <p className="text-gray-400 mb-6">
                        Qualified investors can request access to our latest pitch deck and financial projections. Please contact our relations team directly.
                    </p>
                    <a href="mailto:invest@lanari.rw" className="inline-block px-8 py-3 rounded-full bg-amber-600 text-white font-bold hover:bg-amber-500 transition-colors">
                        Contact Relations
                    </a>
                </div>
            </div>
        </div>
    );
}
