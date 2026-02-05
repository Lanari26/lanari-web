import React from 'react';

export default function Partner() {
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6 text-white">Partner With Us</h1>
                <p className="text-xl text-gray-300 mb-12">
                    Together we can achieve more. We are looking for strategic partners to expand our reach and impact across Africa.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left mb-16">
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <h3 className="text-2xl font-bold text-pink-400 mb-4">For Educational Institutions</h3>
                        <p className="text-gray-400 mb-6">Integrate our Academy curriculum into your school and give your students a head start in the digital economy.</p>
                        <button className="text-white font-bold border-b border-pink-400 hover:text-pink-400 transition-colors">Learn More</button>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700">
                        <h3 className="text-2xl font-bold text-pink-400 mb-4">For Businesses</h3>
                        <p className="text-gray-400 mb-6">Leverage our Rise Network and AI solutions to optimize your operations and find top talent.</p>
                        <button className="text-white font-bold border-b border-pink-400 hover:text-pink-400 transition-colors">Learn More</button>
                    </div>
                </div>

                <div className="bg-gray-800 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Become a Partner</h2>
                    <form className="max-w-md mx-auto space-y-4">
                        <input type="text" placeholder="Organization Name" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white" />
                        <input type="email" placeholder="Contact Email" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white" />
                        <textarea placeholder="Partnership Proposal" className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white h-32"></textarea>
                        <button className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500">Submit Proposal</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
