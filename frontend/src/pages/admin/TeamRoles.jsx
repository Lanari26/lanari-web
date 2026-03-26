import React, { useState } from 'react';
import { api } from './api';
import useTeamData, { emptyRoleForm, toResponsibilities } from './useTeamData';

function Section({ title, subtitle, children }) {
    return (
        <section className="rounded-3xl p-5 sm:p-6" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <div className="mb-5">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                {subtitle && <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {children}
        </section>
    );
}

export default function TeamRoles() {
    const { loading, saving, error, roles, setRoles, runAction } = useTeamData();
    const [roleForm, setRoleForm] = useState(emptyRoleForm);
    const [showForm, setShowForm] = useState(false);

    const createRole = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/roles', {
                ...roleForm,
                responsibilities: toResponsibilities(roleForm.responsibilitiesText)
            }),
            () => {
                setRoleForm(emptyRoleForm);
                setShowForm(false);
            }
        );
    };

    const saveRole = (role) => runAction(() => api.put(`/admin/team/roles/${role.id}`, {
        code: role.code,
        shortLabel: role.shortLabel,
        name: role.name,
        defaultTitle: role.defaultTitle,
        ownershipSummary: role.ownershipSummary,
        sortOrder: role.sort_order,
        responsibilities: toResponsibilities(role.responsibilitiesText)
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Ownership Map</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Define and manage team roles, ownership seats, and responsibilities.
                    </p>
                    {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
                        showForm
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90'
                    }`}
                >
                    <svg className={`w-5 h-5 transition-transform duration-200 ${showForm ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Cancel' : 'Add Role'}
                </button>
            </div>

            {showForm && (
                <section className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-white">Add Custom Role</h2>
                        <p className="text-xs font-medium text-gray-500 mt-1">Default seats ship preloaded, but every role stays editable and you can add more custom seats.</p>
                    </div>
                    <form onSubmit={createRole} className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <input value={roleForm.code} onChange={(e) => setRoleForm((prev) => ({ ...prev, code: e.target.value }))} placeholder="Code" className="rounded-lg px-3 py-2 text-sm bg-gray-950 text-white border border-gray-700 outline-none focus:border-purple-500 transition-colors" />
                        <input value={roleForm.shortLabel} onChange={(e) => setRoleForm((prev) => ({ ...prev, shortLabel: e.target.value }))} placeholder="Short label" className="rounded-lg px-3 py-2 text-sm bg-gray-950 text-white border border-gray-700 outline-none focus:border-purple-500 transition-colors" />
                        <input value={roleForm.name} onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Role name" className="rounded-lg px-3 py-2 text-sm bg-gray-950 text-white border border-gray-700 outline-none focus:border-purple-500 transition-colors" />
                        <input value={roleForm.defaultTitle} onChange={(e) => setRoleForm((prev) => ({ ...prev, defaultTitle: e.target.value }))} placeholder="Default title" className="rounded-lg px-3 py-2 text-sm bg-gray-950 text-white border border-gray-700 outline-none focus:border-purple-500 transition-colors" />
                        <input type="number" value={roleForm.sortOrder} onChange={(e) => setRoleForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))} placeholder="Sort order" className="rounded-lg px-3 py-2 text-sm bg-gray-950 text-white border border-gray-700 outline-none focus:border-purple-500 transition-colors" />
                        <div />
                        <textarea value={roleForm.ownershipSummary} onChange={(e) => setRoleForm((prev) => ({ ...prev, ownershipSummary: e.target.value }))} placeholder="Ownership summary" className="lg:col-span-3 rounded-lg px-3 py-2 text-sm bg-gray-950 text-white border border-gray-700 outline-none focus:border-purple-500 transition-colors min-h-20" />
                        <textarea value={roleForm.responsibilitiesText} onChange={(e) => setRoleForm((prev) => ({ ...prev, responsibilitiesText: e.target.value }))} placeholder="One responsibility per line" className="lg:col-span-3 rounded-lg px-3 py-2 text-sm bg-gray-950 text-white border border-gray-700 outline-none focus:border-purple-500 transition-colors min-h-20" />
                        <div className="lg:col-span-3 flex gap-3 justify-end">
                            <button type="button" onClick={() => { setShowForm(false); setRoleForm(emptyRoleForm); }} className="rounded-lg px-4 py-2 text-sm bg-gray-800 text-gray-400 font-semibold hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button disabled={saving} className="rounded-lg px-5 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold disabled:opacity-50">
                                {saving ? 'Saving...' : 'Add Custom Role'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <Section title="All Roles" subtitle="Edit existing roles and their responsibilities below.">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {roles.map((role, index) => (
                        <div key={role.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em]">{role.code}</div>
                                    <div className="text-lg font-bold text-white mt-1">{role.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{role.assignment_count} assigned member{role.assignment_count !== 1 ? 's' : ''}</div>
                                </div>
                                <button onClick={() => saveRole(role)} disabled={saving} className="rounded-xl px-4 py-2 bg-blue-600 text-white text-sm font-bold disabled:opacity-50">
                                    Save
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input value={role.code} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, code: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={role.shortLabel} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, shortLabel: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={role.name} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={role.defaultTitle} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, defaultTitle: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input type="number" value={role.sort_order} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, sort_order: Number(e.target.value) } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                            </div>
                            <textarea value={role.ownershipSummary} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, ownershipSummary: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                            <textarea value={role.responsibilitiesText} onChange={(e) => setRoles((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, responsibilitiesText: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                        </div>
                    ))}
                    {roles.length === 0 && (
                        <div className="xl:col-span-2 rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No roles defined yet. Click "Add Role" above to create one.
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
