import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Rise() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 aspect-square flex items-center justify-center">
                            <span className="text-9xl">📈</span>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 font-bold text-sm mb-6 border border-purple-500/20">
                            PROFESSIONAL GROWTH
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-white">
                            Rise Network
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            A powerful platform connecting professionals, freelancers, and businesses. Find work, jobs, internships, showcase your skills, and build your network in one place.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => window.open('https://rise.lanari.rw/', '_blank')} className="px-8 py-4 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors">
                                Join Network
                            </button>
                            <button onClick={() => window.open('https://rise.lanari.rw/', '_blank')} className="px-8 py-4 rounded-full border border-gray-600 text-white font-bold hover:bg-gray-800 transition-colors">
                                Find Talent
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl mb-6">🤝</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Connect</h3>
                        <p className="text-gray-400">
                            Meet like-minded professionals and potential collaborators. Expand your circle with meaningful connections.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-2xl mb-6">💼</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Jobs & Freelance</h3>
                        <p className="text-gray-400">
                            Access a vast marketplace of opportunities. From full-time jobs to freelance projects and internships, find what matches your skills.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl mb-6">🚀</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Grow</h3>
                        <p className="text-gray-400">
                            Access resources, mentorship, and tools to accelerate your career growth and business success.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
