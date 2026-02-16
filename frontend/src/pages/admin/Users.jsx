import React, { useState, useEffect } from 'react';
import { api } from './api';

const roleColors = {
    user: { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af' },
    admin: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
    employee: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
};

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const load = () => {
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const updateRole = async (id, role) => {
        await api.patch(`/admin/users/${id}/role`, { role });
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    };

    const toggleActive = async (id) => {
        await api.patch(`/admin/users/${id}/toggle`);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: u.is_active ? 0 : 1 } : u));
    };

    const filtered = users.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder-gray-600"
                    />
                </div>
                <span className="text-sm font-medium text-gray-500">{filtered.length} users</span>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ borderBottom: '1px solid #374151' }}>
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Joined</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Rows */}
                {filtered.length === 0 ? (
                    <div className="text-center py-12"><p className="text-gray-500 font-medium">No users found</p></div>
                ) : filtered.map(user => {
                    const rc = roleColors[user.role];
                    return (
                        <div key={user.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid #374151' }}>
                            <div className="col-span-4 flex items-center gap-3 min-w-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${user.is_active ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-700'}`}>
                                    {user.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className={`text-sm font-bold truncate ${user.is_active ? 'text-white' : 'text-gray-600 line-through'}`}>{user.full_name}</div>
                                    <div className="text-xs font-medium text-gray-500 truncate">{user.email}</div>
                                </div>
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-400">{user.phone_number || '—'}</div>
                            <div className="col-span-2">
                                <select
                                    value={user.role}
                                    onChange={e => updateRole(user.id, e.target.value)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold outline-none cursor-pointer border-0"
                                    style={{ backgroundColor: rc.bg, color: rc.text }}
                                >
                                    <option value="user">User</option>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-500">
                                {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button
                                    onClick={() => toggleActive(user.id)}
                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${user.is_active
                                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                        }`}
                                >
                                    {user.is_active ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
