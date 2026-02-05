import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Services() {
    const navigate = useNavigate();

    const services = [
        {
            title: 'Siri Market',
            desc: 'A revolutionary e-commerce platform that allows you to buy and resell goods without holding stock.',
            icon: '🛍️',
            url: '/siri',
            color: 'from-blue-500 to-cyan-400'
        },
        {
            title: 'Rise Network',
            desc: 'Connect with professionals, find freelance work, and grow your career network.',
            icon: '📈',
            url: '/rise',
            color: 'from-purple-500 to-pink-400'
        },
        {
            title: 'Lanari Academy',
            desc: 'Master in-demand digital skills with our practical coding and design courses.',
            icon: '🎓',
            url: '/academy',
            color: 'from-emerald-500 to-teal-400'
        },
        {
            title: 'AI Solutions',
            desc: 'Leverage artificial intelligence to automate business processes and gain insights.',
            icon: '🤖',
            url: '/ai-products',
            color: 'from-orange-500 to-red-400'
        },
        {
            title: 'Cloud Hosting',
            desc: 'Secure and scalable cloud infrastructure for your applications and data.',
            icon: '☁️',
            url: '/cloud',
            color: 'from-sky-500 to-blue-400'
        },
        {
            title: 'Data Analytics',
            desc: 'Transform your data into actionable insights for better decision making.',
            icon: '📊',
            url: '/analytics',
            color: 'from-indigo-500 to-purple-400'
        }
    ];

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-white">Our Services</h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We offer a comprehensive suite of digital platforms and services designed to empower individuals and businesses in the modern economy.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(service.url)}
                            className="group p-8 rounded-3xl bg-gray-800/40 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 transition-all cursor-pointer flex flex-col h-full"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{service.title}</h3>
                            <p className="text-gray-400 mb-6 flex-grow">{service.desc}</p>
                            <div className="flex items-center text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-200 group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                                Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
