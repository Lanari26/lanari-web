import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-white">Featured Projects</h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Explore some of the innovative solutions we've built to solve real-world problems.
                    </p>
                </div>

                <div className="space-y-24">
                    {[
                        {
                            title: 'Siri Market Mobile App',
                            category: 'Mobile Application',
                            desc: 'A cross-platform mobile application enabling users to buy and resell goods anywhere, even with zero inventory. Features include real-time inventory tracking, secure payments, and profit analytics.',
                            image: '🛍️',
                            color: 'blue'
                        },
                        {
                            title: 'Rise Professional Network',
                            category: 'Web Platform',
                            desc: 'A comprehensive networking platform connecting freelancers with businesses. Includes job boards, internship listings, profile management, and messaging systems.',
                            image: '📈',
                            color: 'purple'
                        },
                        {
                            title: 'Smart Agribiz',
                            category: 'IoT & AI',
                            desc: 'An AI-powered system for farmers to monitor crop health and soil moisture levels, providing actionable insights to optimize yield.',
                            image: '🌱',
                            color: 'green'
                        }
                    ].map((project, i) => (
                        <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                            <div className="flex-1 w-full relative group">
                                <div className={`absolute inset-0 bg-${project.color}-500/20 blur-3xl rounded-full opacity-60 group-hover:opacity-80 transition-opacity`}></div>
                                <div className="relative aspect-video bg-gray-800 rounded-3xl border border-gray-700 flex items-center justify-center text-9xl shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                                    <span className="relative z-10">{project.image}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className={`inline-block px-3 py-1 rounded-full bg-${project.color}-500/10 text-${project.color}-400 text-sm font-bold mb-4 border border-${project.color}-500/20`}>
                                    {project.category}
                                </span>
                                <h2 className="text-4xl font-bold text-white mb-6">{project.title}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    {project.desc}
                                </p>
                                <button onClick={() => navigate('/coming-soon')} className="text-white font-bold text-lg hover:underline decoration-2 underline-offset-4 decoration-blue-500">
                                    View Case Study
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
