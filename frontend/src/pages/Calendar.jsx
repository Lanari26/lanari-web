import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
const COLORS = [
    { name: 'blue', bg: 'bg-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-200', dot: 'bg-blue-500' },
    { name: 'green', bg: 'bg-green-600/20', border: 'border-green-500/30', text: 'text-green-200', dot: 'bg-green-500' },
    { name: 'purple', bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-200', dot: 'bg-purple-500' },
    { name: 'red', bg: 'bg-red-600/20', border: 'border-red-500/30', text: 'text-red-200', dot: 'bg-red-500' },
    { name: 'yellow', bg: 'bg-yellow-600/20', border: 'border-yellow-500/30', text: 'text-yellow-200', dot: 'bg-yellow-500' },
    { name: 'pink', bg: 'bg-pink-600/20', border: 'border-pink-500/30', text: 'text-pink-200', dot: 'bg-pink-500' },
];

const getColor = (name) => COLORS.find(c => c.name === name) || COLORS[0];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({ day: daysInPrev - i, current: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, current: true });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, current: false });
    }
    return cells;
}

function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return `${hr % 12 || 12}:${m} ${ampm}`;
}

export default function Calendar() {
    const navigate = useNavigate();
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', eventDate: '', startTime: '', endTime: '', color: 'blue' });
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchEvents();
    }, [year, month]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/events?year=${year}&month=${month + 1}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setEvents(data.data);
        } catch (e) {
            console.error('Failed to fetch events:', e);
        }
        setLoading(false);
    };

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };
    const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

    const openCreate = (day) => {
        const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setForm({ title: '', description: '', eventDate: d, startTime: '', endTime: '', color: 'blue' });
        setModal('create');
    };

    const openEdit = (evt) => {
        setSelectedEvent(evt);
        setForm({
            title: evt.title,
            description: evt.description || '',
            eventDate: evt.event_date.split('T')[0],
            startTime: evt.start_time || '',
            endTime: evt.end_time || '',
            color: evt.color || 'blue'
        });
        setModal('edit');
    };

    const openView = (evt) => {
        setSelectedEvent(evt);
        setModal('view');
    };

    const closeModal = () => { setModal(null); setSelectedEvent(null); };

    const handleSave = async () => {
        if (!form.title.trim() || !form.eventDate) return;
        setSaving(true);
        try {
            const url = modal === 'edit' ? `${API}/events/${selectedEvent.id}` : `${API}/events`;
            const method = modal === 'edit' ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                await fetchEvents();
                closeModal();
            }
        } catch (e) {
            console.error('Failed to save event:', e);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API}/events/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                await fetchEvents();
                closeModal();
            }
        } catch (e) {
            console.error('Failed to delete event:', e);
        }
    };

    const cells = getCalendarDays(year, month);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const getEventsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.event_date.split('T')[0] === dateStr);
    };

    return (
        <div className="min-h-screen py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Calendar</h1>
                        <p className="text-gray-400 mt-1">Manage your events and schedule</p>
                    </div>
                    <button
                        onClick={() => openCreate(today.getDate())}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold hover:from-blue-500 hover:to-purple-500 text-sm transition-all"
                    >
                        + New Event
                    </button>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6 bg-gray-800/50 rounded-2xl border border-gray-700 p-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">{MONTHS[month]} {year}</h2>
                        <button onClick={goToday} className="px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-colors">
                            Today
                        </button>
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="bg-gray-800/50 rounded-3xl border border-gray-700 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-gray-700 bg-gray-900/80">
                        {DAYS.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {cells.map((cell, i) => {
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
                            const isToday = cell.current && dateStr === todayStr;
                            const dayEvents = cell.current ? getEventsForDay(cell.day) : [];

                            return (
                                <div
                                    key={i}
                                    onClick={() => cell.current && openCreate(cell.day)}
                                    className={`border-r border-b border-gray-700/40 p-1.5 sm:p-2 min-h-[80px] sm:min-h-[110px] transition-colors cursor-pointer
                                        ${cell.current ? 'hover:bg-gray-700/30' : 'bg-gray-900/30'}
                                        ${isToday ? 'bg-blue-900/10' : ''}`}
                                >
                                    <span className={`text-xs sm:text-sm inline-flex items-center justify-center w-6 h-6 rounded-full
                                        ${isToday ? 'bg-blue-500 text-white font-bold' : cell.current ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {cell.day}
                                    </span>
                                    <div className="mt-1 space-y-0.5">
                                        {dayEvents.slice(0, 3).map(evt => {
                                            const c = getColor(evt.color);
                                            return (
                                                <div
                                                    key={evt.id}
                                                    onClick={(e) => { e.stopPropagation(); openView(evt); }}
                                                    className={`${c.bg} ${c.border} border ${c.text} text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80`}
                                                >
                                                    {evt.start_time && <span className="hidden sm:inline">{formatTime(evt.start_time)} </span>}
                                                    {evt.title}
                                                </div>
                                            );
                                        })}
                                        {dayEvents.length > 3 && (
                                            <p className="text-[10px] text-gray-500 pl-1">+{dayEvents.length - 3} more</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events List */}
                {events.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-white mb-4">Events This Month</h3>
                        <div className="space-y-3">
                            {events.map(evt => {
                                const c = getColor(evt.color);
                                const date = new Date(evt.event_date);
                                return (
                                    <div
                                        key={evt.id}
                                        onClick={() => openView(evt)}
                                        className="flex items-center gap-4 p-4 bg-gray-800/40 rounded-2xl border border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer"
                                    >
                                        <div className={`w-3 h-3 rounded-full ${c.dot} flex-shrink-0`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold truncate">{evt.title}</p>
                                            {evt.description && <p className="text-gray-400 text-sm truncate">{evt.description}</p>}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-gray-300 text-sm font-medium">
                                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                            {evt.start_time && (
                                                <p className="text-gray-500 text-xs">
                                                    {formatTime(evt.start_time)}{evt.end_time ? ` - ${formatTime(evt.end_time)}` : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!loading && events.length === 0 && (
                    <div className="mt-8 text-center py-12 text-gray-500">
                        <div className="text-5xl mb-4">📅</div>
                        <p className="text-lg">No events this month</p>
                        <p className="text-sm mt-1">Click on any day to create one</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                    <div onClick={e => e.stopPropagation()} className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
                        {/* View Mode */}
                        {modal === 'view' && selectedEvent && (
                            <>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getColor(selectedEvent.color).dot}`} />
                                        <h2 className="text-xl font-bold text-white">{selectedEvent.title}</h2>
                                    </div>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                {selectedEvent.description && (
                                    <p className="text-gray-400 mb-4">{selectedEvent.description}</p>
                                )}
                                <div className="space-y-2 text-sm text-gray-300 mb-6">
                                    <p><span className="text-gray-500">Date:</span> {new Date(selectedEvent.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    {selectedEvent.start_time && (
                                        <p><span className="text-gray-500">Time:</span> {formatTime(selectedEvent.start_time)}{selectedEvent.end_time ? ` - ${formatTime(selectedEvent.end_time)}` : ''}</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => openEdit(selectedEvent)} className="flex-1 py-2.5 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-500 text-sm transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(selectedEvent.id)} className="flex-1 py-2.5 bg-red-600/20 border border-red-500/30 rounded-xl text-red-300 font-semibold hover:bg-red-600/40 text-sm transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Create / Edit Mode */}
                        {(modal === 'create' || modal === 'edit') && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">{modal === 'edit' ? 'Edit Event' : 'New Event'}</h2>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Event title *"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                    />
                                    <textarea
                                        placeholder="Description (optional)"
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none h-20 resize-none"
                                    />
                                    <input
                                        type="date"
                                        value={form.eventDate}
                                        onChange={e => setForm({ ...form, eventDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">Start time</label>
                                            <input
                                                type="time"
                                                value={form.startTime}
                                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">End time</label>
                                            <input
                                                type="time"
                                                value={form.endTime}
                                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-2 block">Color</label>
                                        <div className="flex gap-2">
                                            {COLORS.map(c => (
                                                <button
                                                    key={c.name}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, color: c.name })}
                                                    className={`w-8 h-8 rounded-full ${c.dot} transition-all ${form.color === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110' : 'opacity-60 hover:opacity-100'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !form.title.trim()}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : modal === 'edit' ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
