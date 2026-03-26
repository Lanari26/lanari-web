import React from 'react';
import { api } from './api';
import useTeamData from './useTeamData';

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

export default function TeamReports() {
    const { loading, saving, error, reports, summary, runAction } = useTeamData();

    const reviewReport = (reportId) => runAction(() => api.patch(`/admin/team/reports/${reportId}/review`));

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
                <h1 className="text-2xl font-bold text-white">Reports Feed</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Review submitted reports and close the loop with your team.
                </p>
                {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
            </div>

            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <div className="text-3xl font-bold text-pink-400">{summary.pendingReports}</div>
                        <div className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wider">Pending Reports</div>
                    </div>
                    <div className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                        <div className="text-3xl font-bold text-emerald-400">{reports.filter(r => r.status === 'reviewed').length}</div>
                        <div className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wider">Reviewed Reports</div>
                    </div>
                </div>
            )}

            <Section title="All Reports" subtitle="Submitted reports arrive here for admin review and close the loop with the team.">
                <div className="space-y-4">
                    {reports.length === 0 && (
                        <div className="rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No reports submitted yet.
                        </div>
                    )}
                    {reports.map((report) => (
                        <div key={report.id} className="rounded-2xl p-5" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold text-white">{report.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${report.status === 'reviewed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {report.author_name} · {new Date(report.report_date).toLocaleDateString()} {report.task_title ? `· Linked to "${report.task_title}"` : ''}
                                    </p>
                                    <p className="text-sm text-gray-300 mt-4 leading-relaxed whitespace-pre-wrap">{report.body}</p>
                                    {report.reviewer_name && (
                                        <p className="text-xs text-emerald-400 font-semibold mt-3">
                                            Reviewed by {report.reviewer_name}
                                        </p>
                                    )}
                                </div>
                                {report.status !== 'reviewed' && (
                                    <button onClick={() => reviewReport(report.id)} disabled={saving} className="rounded-xl px-4 py-3 bg-emerald-600 text-white font-bold disabled:opacity-50 flex-shrink-0">
                                        Mark Reviewed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
