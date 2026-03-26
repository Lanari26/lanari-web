import React, { useState } from 'react';
import { api } from './api';
import useTeamData, { emptyMemberForm } from './useTeamData';

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

export default function TeamMembers() {
    const { loading, saving, error, members, setMembers, roles, runAction } = useTeamData();
    const [memberForm, setMemberForm] = useState(emptyMemberForm);
    const [showForm, setShowForm] = useState(false);

    const createMember = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/members', {
                ...memberForm,
                teamRoleId: memberForm.teamRoleId || null
            }),
            () => {
                setMemberForm(emptyMemberForm);
                setShowForm(false);
            }
        );
    };

    const saveMember = (member) => runAction(() => api.patch(`/admin/team/members/${member.id}`, {
        fullName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        role: member.role,
        isActive: member.isActive,
        teamRoleId: member.teamRoleId || null,
        displayTitle: member.displayTitle,
        staffCode: member.staffCode,
        bio: member.bio,
        ownershipSummary: member.ownershipSummary
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
                    <h1 className="text-2xl font-bold text-white">Team Members</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Create staff accounts and manage existing team member profiles.
                    </p>
                    {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
                        showForm
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                    }`}
                >
                    <svg className={`w-5 h-5 transition-transform duration-200 ${showForm ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Cancel' : 'Add Member'}
                </button>
            </div>

            {showForm && (
                <section className="rounded-3xl p-5 sm:p-6 animate-in" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-white">Create Staff Account</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Admins can add staff directly without waiting for public registration.</p>
                    </div>
                    <form onSubmit={createMember} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={memberForm.fullName} onChange={(e) => setMemberForm((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Full name" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors" />
                        <input value={memberForm.email} onChange={(e) => setMemberForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors" />
                        <input value={memberForm.phoneNumber} onChange={(e) => setMemberForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="Phone number" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors" />
                        <input value={memberForm.password} onChange={(e) => setMemberForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Temporary password" type="password" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors" />
                        <select value={memberForm.role} onChange={(e) => setMemberForm((prev) => ({ ...prev, role: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <select value={memberForm.teamRoleId} onChange={(e) => setMemberForm((prev) => ({ ...prev, teamRoleId: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors">
                            <option value="">Select ownership seat</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.code} · {role.name}</option>
                            ))}
                        </select>
                        <input value={memberForm.displayTitle} onChange={(e) => setMemberForm((prev) => ({ ...prev, displayTitle: e.target.value }))} placeholder="Display title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors" />
                        <input value={memberForm.staffCode} onChange={(e) => setMemberForm((prev) => ({ ...prev, staffCode: e.target.value }))} placeholder="Staff code" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors" />
                        <textarea value={memberForm.bio} onChange={(e) => setMemberForm((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Bio or context" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors min-h-24" />
                        <textarea value={memberForm.ownershipSummary} onChange={(e) => setMemberForm((prev) => ({ ...prev, ownershipSummary: e.target.value }))} placeholder="Optional member-specific ownership summary" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-blue-500 transition-colors min-h-24" />
                        <div className="sm:col-span-2 flex gap-3">
                            <button disabled={saving} className="flex-1 rounded-xl px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold disabled:opacity-50">
                                {saving ? 'Saving...' : 'Create Staff Member'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setMemberForm(emptyMemberForm); }} className="rounded-xl px-6 py-3 bg-gray-800 text-gray-400 font-bold hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <Section title="All Members" subtitle="Every staff profile can carry an ownership seat, operating title, and member-specific notes.">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {members.map((member, index) => (
                        <div key={member.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-lg font-bold text-white">{member.fullName}</div>
                                    <div className="text-xs font-medium text-gray-500">{member.email}</div>
                                </div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                    <input
                                        type="checkbox"
                                        checked={member.isActive}
                                        onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, isActive: e.target.checked } : item))}
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input value={member.fullName} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, fullName: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={member.phoneNumber} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, phoneNumber: e.target.value } : item))} placeholder="Phone" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={member.email} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, email: e.target.value } : item))} className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <select value={member.role} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, role: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <select value={member.teamRoleId} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, teamRoleId: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    <option value="">No ownership seat</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.code} · {role.name}</option>
                                    ))}
                                </select>
                                <input value={member.displayTitle} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, displayTitle: e.target.value } : item))} placeholder="Display title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={member.staffCode} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, staffCode: e.target.value } : item))} placeholder="Staff code" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <textarea value={member.bio} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, bio: e.target.value } : item))} placeholder="Bio" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                                <textarea value={member.ownershipSummary} onChange={(e) => setMembers((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, ownershipSummary: e.target.value } : item))} placeholder="Member-specific ownership summary" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                            </div>
                            <button onClick={() => saveMember(member)} disabled={saving} className="rounded-xl px-4 py-3 bg-blue-600 text-white font-bold disabled:opacity-50">
                                Save Member
                            </button>
                        </div>
                    ))}
                    {members.length === 0 && (
                        <div className="xl:col-span-2 rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No team members yet. Click "Add Member" above to create the first one.
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
