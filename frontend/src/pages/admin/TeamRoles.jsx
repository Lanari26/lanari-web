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

    const createRole = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/roles', {
                ...roleForm,
                responsibilities: toResponsibilities(roleForm.responsibilitiesText)
            }),
            () => setRoleForm(emptyRoleForm)
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
            <div>
                <h1 className="text-2xl font-bold text-white">Ownership Map</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Define and manage team roles, ownership seats, and responsibilities.
                </p>
                {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
            </div>

            <Section title="Add Custom Role" subtitle="Default seats ship preloaded, but every role stays editable and you can add more custom seats.">
                <form onSubmit={createRole} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <input value={roleForm.code} onChange={(e) => setRoleForm((prev) => ({ ...prev, code: e.target.value }))} placeholder="Code" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={roleForm.shortLabel} onChange={(e) => setRoleForm((prev) => ({ ...prev, shortLabel: e.target.value }))} placeholder="Short label" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={roleForm.name} onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Role name" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={roleForm.defaultTitle} onChange={(e) => setRoleForm((prev) => ({ ...prev, defaultTitle: e.target.value }))} placeholder="Default title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input type="number" value={roleForm.sortOrder} onChange={(e) => setRoleForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))} placeholder="Sort order" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <div />
                    <textarea value={roleForm.ownershipSummary} onChange={(e) => setRoleForm((prev) => ({ ...prev, ownershipSummary: e.target.value }))} placeholder="Ownership summary" className="lg:col-span-3 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                    <textarea value={roleForm.responsibilitiesText} onChange={(e) => setRoleForm((prev) => ({ ...prev, responsibilitiesText: e.target.value }))} placeholder="One responsibility per line" className="lg:col-span-3 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                    <button disabled={saving} className="lg:col-span-3 rounded-xl px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold disabled:opacity-50">
                        {saving ? 'Saving...' : 'Add Custom Role'}
                    </button>
                </form>
            </Section>

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
                            No roles defined yet.
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
