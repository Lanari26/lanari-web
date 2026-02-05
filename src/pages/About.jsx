import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen py-24 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">About Lanari Tech</h1>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-white mb-6">Who We Are</h2>
                    <p className="text-xl text-gray-300 leading-relaxed mb-6">
                        Lanari Tech is a pioneering technology company based in Rwanda, dedicated to driving digital transformation across Africa.
                        We believe in the power of technology to solve real-world problems, empower individuals, and accelerate economic growth.
                    </p>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        Founded with a vision to make advanced technology accessible to everyone, we have developed an ecosystem of platforms
                        that span e-commerce, professional networking, education, and artificial intelligence.
                    </p>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-white mb-6">Our Mission</h2>
                    <div className="p-8 rounded-3xl bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
                        <p className="text-2xl font-medium text-gray-200 italic">
                            "To empower every individual and organization in Africa to achieve more through innovative, accessible, and life-changing digital solutions."
                        </p>
                    </div>
                </section>

                <section className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-gray-800/30 border border-gray-700">
                        <h3 className="text-2xl font-bold text-blue-400 mb-4">Innovation</h3>
                        <p className="text-gray-300">We constantly push the boundaries of what's possible, exploring new technologies to better serve our community.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/30 border border-gray-700">
                        <h3 className="text-2xl font-bold text-purple-400 mb-4">Integrity</h3>
                        <p className="text-gray-300">We build trust through transparency, honesty, and a steadfast commitment to doing what is right for our users.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/30 border border-gray-700">
                        <h3 className="text-2xl font-bold text-emerald-400 mb-4">Impact</h3>
                        <p className="text-gray-300">We measure our success by the tangible positive changes we create in the lives of people and businesses.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/30 border border-gray-700">
                        <h3 className="text-2xl font-bold text-orange-400 mb-4">Inclusion</h3>
                        <p className="text-gray-300">We design for everyone, ensuring our tools are accessible and beneficial to people from all walks of life.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
