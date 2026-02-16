import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Academy() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm mb-6 border border-emerald-500/20">
                        FUTURE SKILLS
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-white">
                        Lanari Academy
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Master the skills of tomorrow. We provide practical, hands-on training in coding, design, business, and digital marketing to prepare you for the global job market.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {[
                        { title: 'Web Development', icon: '💻', desc: 'Master React, Node.js, and modern web technologies.' },
                        { title: 'Data Science', icon: '📊', desc: 'Learn to analyze data and build predictive models with Python.' },
                        { title: 'Digital Marketing', icon: '📱', desc: 'Strategies to grow brands in the digital age.' },
                        { title: 'UI/UX Design', icon: '🎨', desc: 'Design beautiful, user-centric interfaces and experiences.' },
                        { title: 'Mobile App Dev', icon: '📱', desc: 'Build native iOS and Android applications.' },
                        { title: 'Entrepreneurship', icon: '🚀', desc: 'From idea to launch: building scalable businesses.' },
                    ].map((course, i) => (
                        <div key={i} onClick={() => window.open('https://lca.lanari.rw/', '_blank')} className="group p-8 rounded-3xl bg-gray-800/40 border border-gray-700 hover:border-emerald-500/50 transition-all hover:-translate-y-2 cursor-pointer">
                            <div className="text-4xl mb-6">{course.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                            <p className="text-gray-400 mb-6">{course.desc}</p>
                            <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                View Curriculum <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-3xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Start learning for free</h2>
                    <p className="text-gray-300 mb-8">Access our introductory courses and start your journey today.</p>
                    <button onClick={() => window.open('https://lca.lanari.rw/', '_blank')} className="px-8 py-4 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">
                        Browse Free Courses
                    </button>
                </div>
            </div>
        </div>
    );
}
