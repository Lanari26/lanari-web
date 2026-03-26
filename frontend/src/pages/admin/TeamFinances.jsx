import React, { useState } from 'react';
import { api } from './api';
import useTeamData, { emptyMoneyOfferForm, moneyStatusOptions } from './useTeamData';

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

export default function TeamFinances() {
    const { loading, saving, error, members, moneyRequests, setMoneyRequests, summary, runAction } = useTeamData();
    const [moneyOfferForm, setMoneyOfferForm] = useState(emptyMoneyOfferForm);

    const createMoneyOffer = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/money-requests/offers', {
                ...moneyOfferForm,
                beneficiaryUserId: Number(moneyOfferForm.beneficiaryUserId),
                amount: Number(moneyOfferForm.amount)
            }),
            () => setMoneyOfferForm(emptyMoneyOfferForm)
        );
    };

    const saveMoneyRequest = (request) => runAction(() => api.patch(`/admin/team/money-requests/${request.id}`, {
        status: request.status,
        adminNote: request.adminNote,
        paymentProvider: request.paymentProvider,
        paymentReference: request.paymentReference
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
                <h1 className="text-2xl font-bold text-white">Finances</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Manage money offers, staff requests, and payment tracking.
                </p>
                {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
            </div>

            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Pending Money', value: summary.pendingMoneyRequests, accent: 'text-cyan-400' },
                        { label: 'Paid Requests', value: summary.paidMoneyRequests, accent: 'text-violet-400' },
                        { label: 'Total Paid', value: `${Number(summary.totalPaidAmount || 0).toFixed(2)} RWF`, accent: 'text-lime-400' }
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className={`text-3xl font-bold ${item.accent}`}>{item.value}</div>
                            <div className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wider">{item.label}</div>
                        </div>
                    ))}
                </div>
            )}

            <Section title="Offer Money" subtitle="Admins can proactively offer or disburse money to staff through any provider or custom channel.">
                <form onSubmit={createMoneyOffer} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <select value={moneyOfferForm.beneficiaryUserId} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, beneficiaryUserId: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                        <option value="">Choose staff member</option>
                        {members.filter((member) => member.isActive).map((member) => (
                            <option key={member.id} value={member.id}>{member.fullName}</option>
                        ))}
                    </select>
                    <input value={moneyOfferForm.title} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Offer title" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.amount} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Amount" type="number" min="0" step="0.01" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.currency} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, currency: e.target.value.toUpperCase() }))} placeholder="Currency" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.paymentProvider} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, paymentProvider: e.target.value }))} placeholder="Provider or channel (MBS, MoMo, bank...)" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input value={moneyOfferForm.paymentReference} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, paymentReference: e.target.value }))} placeholder="Wallet / account / reference" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <select value={moneyOfferForm.status} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, status: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                        <option value="approved">Approved offer</option>
                        <option value="paid">Already paid</option>
                        <option value="pending">Pending review</option>
                    </select>
                    <div />
                    <textarea value={moneyOfferForm.note} onChange={(e) => setMoneyOfferForm((prev) => ({ ...prev, note: e.target.value }))} placeholder="Why this money is being offered" className="sm:col-span-2 xl:col-span-4 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                    <button disabled={saving} className="sm:col-span-2 xl:col-span-4 rounded-xl px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold disabled:opacity-50">
                        {saving ? 'Saving...' : 'Create Admin Offer'}
                    </button>
                </form>
            </Section>

            <Section title="Money Requests & Offers" subtitle="Staff can request funds; admins can approve, reject, mark paid, or issue direct offers.">
                <div className="space-y-4">
                    {moneyRequests.length === 0 && (
                        <div className="rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No money activity yet.
                        </div>
                    )}
                    {moneyRequests.map((request, index) => (
                        <div key={request.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold text-white">{request.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                                            request.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' :
                                            request.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                                            request.status === 'approved' ? 'bg-blue-500/15 text-blue-400' :
                                            'bg-amber-500/15 text-amber-400'
                                        }`}>
                                            {request.status}
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-300">
                                            {request.source === 'admin_offer' ? 'admin offer' : 'staff request'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        For {request.beneficiary_name} · {Number(request.amount).toFixed(2)} {request.currency}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Initiated by {request.initiator_name} · {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                    {request.note && <p className="text-sm text-gray-300 mt-3 whitespace-pre-wrap">{request.note}</p>}
                                    {request.reviewer_name && (
                                        <p className="text-xs text-emerald-400 mt-3 font-semibold">Last reviewed by {request.reviewer_name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                <select value={request.status} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, status: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {moneyStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                                <input value={request.paymentProvider} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, paymentProvider: e.target.value } : item))} placeholder="Provider / channel" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input value={request.paymentReference} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, paymentReference: e.target.value } : item))} placeholder="Payment reference" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <button onClick={() => saveMoneyRequest(request)} disabled={saving} className="rounded-xl px-4 py-3 bg-cyan-600 text-white font-bold disabled:opacity-50">
                                    Save Money Status
                                </button>
                            </div>
                            <textarea value={request.adminNote} onChange={(e) => setMoneyRequests((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, adminNote: e.target.value } : item))} placeholder="Admin note for approval, rejection, or payout context" className="w-full rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-20" />
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
