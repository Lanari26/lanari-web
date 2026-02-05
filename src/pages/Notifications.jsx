import React from 'react';

export default function Notifications() {
    const notifications = [
        {
            title: 'System Update',
            desc: 'Lanari Tech platform maintenance scheduled for Saturday, Feb 10th at 2:00 AM UTC.',
            time: '2 hours ago',
            type: 'system',
            read: false
        },
        {
            title: 'Welcome to Siri Market',
            desc: 'Get started with Siri Market today! Check out our guide for new traders.',
            time: '1 day ago',
            type: 'info',
            read: true
        },
        {
            title: 'New Course Available',
            desc: 'Advanced React patterns course is now live on Lanari Academy.',
            time: '3 days ago',
            type: 'success',
            read: true
        }
    ];

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Notifications</h1>
                    <button className="text-sm text-blue-400 hover:text-blue-300 font-semibold">Mark all as read</button>
                </div>

                <div className="space-y-4">
                    {notifications.map((notif, i) => (
                        <div key={i} className={`p-6 rounded-2xl border ${notif.read ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-800/80 border-blue-500/30'} transition-colors hover:bg-gray-800`}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 ${notif.read ? 'text-gray-300' : 'text-white'}`}>{notif.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{notif.desc}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{notif.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <div className="text-5xl mb-4">🔕</div>
                        <p>No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
}
