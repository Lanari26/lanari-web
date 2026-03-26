import React, { useState } from 'react';
import { api } from './api';
import useTeamData, { emptyRuleForm } from './useTeamData';

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

export default function TeamRules() {
    const { loading, saving, error, decisionRules, setDecisionRules, runAction } = useTeamData();
    const [ruleForm, setRuleForm] = useState(emptyRuleForm);
    const [showForm, setShowForm] = useState(false);

    const createRule = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/decision-rules', ruleForm),
            () => {
                setRuleForm(emptyRuleForm);
                setShowForm(false);
            }
        );
    };

    const saveRule = (rule) => runAction(() => api.put(`/admin/team/decision-rules/${rule.id}`, {
        question: rule.question,
        answer: rule.answer,
        sortOrder: rule.sortOrder
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
                    <h1 className="text-2xl font-bold text-white">Decision Rules</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Standing answers that remove ambiguity before each sprint.
                    </p>
                    {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
                        showForm
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:opacity-90'
                    }`}
                >
                    <svg className={`w-5 h-5 transition-transform duration-200 ${showForm ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Cancel' : 'Add Rule'}
                </button>
            </div>

            {showForm && (
                <section className="rounded-3xl p-5 sm:p-6" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-white">Add Decision Rule</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Define Q&A pairs that guide team decisions consistently.</p>
                    </div>
                    <form onSubmit={createRule} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <input value={ruleForm.question} onChange={(e) => setRuleForm((prev) => ({ ...prev, question: e.target.value }))} placeholder="Question" className="lg:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-orange-500 transition-colors" />
                        <input type="number" value={ruleForm.sortOrder} onChange={(e) => setRuleForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))} placeholder="Sort order" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-orange-500 transition-colors" />
                        <textarea value={ruleForm.answer} onChange={(e) => setRuleForm((prev) => ({ ...prev, answer: e.target.value }))} placeholder="Answer" className="lg:col-span-3 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none focus:border-orange-500 transition-colors min-h-28" />
                        <div className="lg:col-span-3 flex gap-3 justify-end">
                            <button type="button" onClick={() => { setShowForm(false); setRuleForm(emptyRuleForm); }} className="rounded-lg px-4 py-2 text-sm bg-gray-800 text-gray-400 font-semibold hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button disabled={saving} className="rounded-lg px-5 py-2 text-sm bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold disabled:opacity-50">
                                {saving ? 'Saving...' : 'Add Decision Rule'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <Section title="All Rules" subtitle="Edit existing rules below.">
                <div className="space-y-4">
                    {decisionRules.map((rule, index) => (
                        <div key={rule.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr,140px,120px] gap-3">
                                <input value={rule.question} onChange={(e) => setDecisionRules((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, question: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <input type="number" value={rule.sortOrder} onChange={(e) => setDecisionRules((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, sortOrder: Number(e.target.value) } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <button onClick={() => saveRule(rule)} disabled={saving} className="rounded-xl px-4 py-3 bg-blue-600 text-white font-bold disabled:opacity-50">
                                    Save Rule
                                </button>
                            </div>
                            <textarea value={rule.answer} onChange={(e) => setDecisionRules((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, answer: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                        </div>
                    ))}
                    {decisionRules.length === 0 && (
                        <div className="rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No decision rules yet. Click "Add Rule" above to create one.
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
