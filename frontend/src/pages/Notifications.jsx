import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const typeStyles = {
    system: 'bg-gray-500',
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
};

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setNotifications(data.data);
        } catch (e) {
            console.error('Failed to fetch notifications:', e);
        }
        setLoading(false);
    };

    const markAllRead = async () => {
        try {
            await fetch(`${API}/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        } catch (e) {
            console.error('Failed to mark all read:', e);
        }
    };

    const markRead = async (id) => {
        try {
            await fetch(`${API}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (e) {
            console.error('Failed to mark read:', e);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) {
        return (
            <div className="min-h-screen py-24 px-6 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-gray-400 text-sm mt-1">{unreadCount} unread</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-sm text-blue-400 hover:text-blue-300 font-semibold">
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {notifications.map(notif => (
                        <div
                            key={notif.id}
                            onClick={() => !notif.is_read && markRead(notif.id)}
                            className={`p-6 rounded-2xl border transition-colors ${
                                notif.is_read
                                    ? 'bg-gray-800/30 border-gray-700'
                                    : 'bg-gray-800/80 border-blue-500/30 cursor-pointer hover:bg-gray-800'
                            }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.is_read ? 'bg-transparent' : typeStyles[notif.type] || 'bg-blue-500'}`} />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-bold text-lg ${notif.is_read ? 'text-gray-300' : 'text-white'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase ${
                                                notif.type === 'success' ? 'bg-green-600/20 text-green-300' :
                                                notif.type === 'warning' ? 'bg-yellow-600/20 text-yellow-300' :
                                                notif.type === 'system' ? 'bg-gray-600/20 text-gray-300' :
                                                'bg-blue-600/20 text-blue-300'
                                            }`}>
                                                {notif.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">{notif.description}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                    {timeAgo(notif.created_at)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <div className="text-5xl mb-4">🔔</div>
                        <p className="text-lg">No notifications yet</p>
                        <p className="text-sm mt-1">You'll see updates here when something happens</p>
                    </div>
                )}
            </div>
        </div>
    );
}
