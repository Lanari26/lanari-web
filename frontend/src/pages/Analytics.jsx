import React from 'react';

export default function Analytics() {
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl font-bold mb-6 text-white">Data Insights</h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Transform raw data into actionable insights. monitoring real-time performance of your Siri Market store or Rise Network profile.
                        </p>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                Real-time sales tracking
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                User engagement metrics
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                Growth forecasting
                            </li>
                        </ul>
                    </div>
                    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl">
                        {/* Mock Chart */}
                        <div className="flex items-end justify-between h-64 gap-2 px-4 pb-4 border-b border-gray-600">
                            {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                                <div key={i} className="w-full bg-indigo-500/50 rounded-t-lg hover:bg-indigo-500 transition-colors" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm mt-4 px-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
