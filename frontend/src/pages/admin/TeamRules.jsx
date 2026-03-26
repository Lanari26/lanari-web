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

    const createRule = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/decision-rules', ruleForm),
            () => setRuleForm(emptyRuleForm)
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
            <div>
                <h1 className="text-2xl font-bold text-white">Decision Rules</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Standing answers that remove ambiguity before each sprint.
                </p>
                {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
            </div>

            <Section title="Add Decision Rule" subtitle="Define Q&A pairs that guide team decisions consistently.">
                <form onSubmit={createRule} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <input value={ruleForm.question} onChange={(e) => setRuleForm((prev) => ({ ...prev, question: e.target.value }))} placeholder="Question" className="lg:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <input type="number" value={ruleForm.sortOrder} onChange={(e) => setRuleForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))} placeholder="Sort order" className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <textarea value={ruleForm.answer} onChange={(e) => setRuleForm((prev) => ({ ...prev, answer: e.target.value }))} placeholder="Answer" className="lg:col-span-3 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                    <button disabled={saving} className="lg:col-span-3 rounded-xl px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold disabled:opacity-50">
                        {saving ? 'Saving...' : 'Add Decision Rule'}
                    </button>
                </form>
            </Section>

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
                            No decision rules yet. Add one above.
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
