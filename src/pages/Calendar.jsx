import React from 'react';

export default function Calendar() {
    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">My Calendar</h1>
                    <button className="px-4 py-2 bg-green-600 rounded-lg text-white font-bold hover:bg-green-500 text-sm">
                        + New Event
                    </button>
                </div>

                <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-gray-700 bg-gray-900">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-4 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 h-[600px]">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className={`border-r border-b border-gray-700/50 p-2 min-h-[100px] hover:bg-gray-700/30 transition-colors ${i === 15 ? 'bg-green-900/10' : ''}`}>
                                <span className={`text-sm ${i === 15 ? 'bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-500'}`}>
                                    {i + 1 > 31 ? i - 30 : i + 1}
                                </span>
                                {i === 15 && (
                                    <div className="mt-2 p-1.5 rounded bg-green-600/20 border border-green-500/30 text-xs text-green-200 truncate">
                                        Team Meeting
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
