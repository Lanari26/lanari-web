import React from 'react';

export default function Docs() {
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-white">Documentation Center</h1>
                <div className="relative mb-12">
                    <input type="text" placeholder="Search documentation..." className="w-full px-6 py-4 rounded-2xl bg-gray-800 border border-gray-700 text-white focus:border-yellow-500 outline-none" />
                    <svg className="absolute right-6 top-4 w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">Getting Started</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>• Introduction to Lanari Tech</li>
                            <li>• Creating your account</li>
                            <li>• Account security basics</li>
                        </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">Siri Market API</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>• Selling via API</li>
                            <li>• Inventory management</li>
                            <li>• Webhooks & notifications</li>
                        </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">Developer Tools</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>• SDKs and Libraries</li>
                            <li>• CLI Reference</li>
                            <li>• Authentication Guide</li>
                        </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700 hover:border-yellow-500/50 transition-all cursor-pointer">
                        <h3 className="text-xl font-bold text-yellow-400 mb-2">Community & Support</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>• Forum discussions</li>
                            <li>• Frequently Asked Questions</li>
                            <li>• Contact Support</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
