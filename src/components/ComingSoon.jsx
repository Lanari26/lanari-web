import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0a0e1a', color: '#ffffff' }}>
            {/* Background elements similar to main page */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl top-1/4 left-1/4" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)' }} />
                <div className="absolute w-[400px] h-[400px] rounded-full blur-3xl bottom-1/4 right-1/4" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)' }} />
            </div>

            <div className="z-10 text-center px-6">
                <div className="mb-8 animate-bounce">
                    <span className="text-6xl">🚀</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Coming Soon
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    We're working hard to bring you something amazing. This feature is currently under development.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default ComingSoon;
