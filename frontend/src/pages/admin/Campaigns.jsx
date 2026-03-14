import React, { useState, useEffect, useRef } from 'react';
import { api } from './api';

const AUDIENCES = [
    { value: 'all', label: 'All Active Users', color: '#3b82f6' },
    { value: 'user', label: 'Regular Users Only', color: '#10b981' },
    { value: 'employee', label: 'Employees Only', color: '#8b5cf6' },
    { value: 'admin', label: 'Admins Only', color: '#f59e0b' },
    { value: 'inactive', label: 'Inactive Users', color: '#ef4444' },
];

function StatusBadge({ status }) {
    const styles = {
        draft: { bg: '#374151', color: '#9ca3af', label: 'Draft' },
        sending: { bg: '#1e3a5f', color: '#60a5fa', label: 'Sending...' },
        sent: { bg: '#064e3b', color: '#34d399', label: 'Sent' },
        failed: { bg: '#7f1d1d', color: '#fca5a5', label: 'Failed' },
    };
    const s = styles[status] || styles.draft;
    return (
        <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {s.label}
        </span>
    );
}

function TemplateCard({ template, selected, onClick }) {
    const icons = {
        newsletter: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
        productLaunch: 'M13 10V3L4 14h7v7l9-11h-7z',
        promotion: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
        event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        announcement: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
        welcome_back: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    };
    const colors = {
        newsletter: ['#3b82f6', '#2563eb'],
        productLaunch: ['#10b981', '#059669'],
        promotion: ['#f59e0b', '#d97706'],
        event: ['#8b5cf6', '#6d28d9'],
        announcement: ['#3b82f6', '#8b5cf6'],
        welcome_back: ['#ec4899', '#db2777'],
    };
    const [c1, c2] = colors[template.key] || ['#3b82f6', '#8b5cf6'];

    return (
        <button
            onClick={onClick}
            style={{
                background: selected ? `linear-gradient(135deg, ${c1}22, ${c2}22)` : '#111827',
                border: `2px solid ${selected ? c1 : '#1f2937'}`,
                borderRadius: 16,
                padding: 20,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icons[template.key] || icons.announcement} />
                    </svg>
                </div>
                <div>
                    <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 15 }}>{template.name}</p>
                    <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: 12, lineHeight: 1.4 }}>{template.description}</p>
                </div>
            </div>
        </button>
    );
}

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // list | create | preview
    const [sending, setSending] = useState(null);
    const [previewCampaign, setPreviewCampaign] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [audience, setAudience] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [useManual, setUseManual] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const previewRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [campaignsRes, templatesRes] = await Promise.all([
                api.get('/campaigns'),
                api.get('/campaigns/templates'),
            ]);
            setCampaigns(campaignsRes.data);
            setTemplates(templatesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setSubject('');
        setAudience('all');
        setSelectedTemplate(null);
        setHtmlContent('');
        setUseManual(false);
        setError('');
    };

    const handleSelectTemplate = (t) => {
        setSelectedTemplate(t);
        setSubject(t.subject);
        setHtmlContent(t.html);
        setUseManual(false);
    };

    const handleSwitchToManual = () => {
        setUseManual(true);
        setSelectedTemplate(null);
        if (!htmlContent) {
            setHtmlContent(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0e1a;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px 40px;border-radius:16px 16px 0 0;">
    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Lanari Tech</h1>
  </td></tr>
  <tr><td style="background-color:#1f2937;padding:40px;border:1px solid #374151;border-top:none;">
    <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Hello {{name}},</h2>
    <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
      Your email content goes here...
    </p>
  </td></tr>
  <tr><td style="padding:24px 40px;text-align:center;">
    <p style="margin:0;color:#4b5563;font-size:11px;">&copy; 2026 Lanari Tech. All rights reserved.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`);
        }
    };

    const handleCreate = async () => {
        if (!title.trim() || !subject.trim() || !htmlContent.trim()) {
            setError('Please fill in title, subject, and email content.');
            return;
        }
        try {
            setSaving(true);
            setError('');
            await api.post('/campaigns', {
                title,
                subject,
                templateKey: selectedTemplate?.key || null,
                htmlContent,
                audience,
            });
            resetForm();
            setView('list');
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSend = async (id) => {
        if (!window.confirm('Are you sure you want to send this campaign? This action cannot be undone.')) return;
        try {
            setSending(id);
            await api.post(`/campaigns/${id}/send`);
            // Reload after a brief delay to get updated status
            setTimeout(() => loadData(), 2000);
        } catch (err) {
            alert(err.message);
        } finally {
            setSending(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this draft campaign?')) return;
        try {
            await api.del(`/campaigns/${id}`);
            await loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const handlePreview = (campaign) => {
        setPreviewCampaign(campaign);
        setView('preview');
    };

    // Render preview iframe
    useEffect(() => {
        if (view === 'preview' && previewRef.current && previewCampaign) {
            const doc = previewRef.current.contentDocument;
            doc.open();
            doc.write(previewCampaign.html_content || previewCampaign.html || '');
            doc.close();
        }
    }, [view, previewCampaign]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ width: 40, height: 40, border: '3px solid #374151', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    /* ─── Preview View ─── */
    if (view === 'preview' && previewCampaign) {
        return (
            <div>
                <button
                    onClick={() => { setView('list'); setPreviewCampaign(null); }}
                    style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back to Campaigns
                </button>
                <div style={{ background: '#111827', borderRadius: 16, border: '1px solid #1f2937', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: 16 }}>{previewCampaign.title}</h3>
                            <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: 13 }}>Subject: {previewCampaign.subject}</p>
                        </div>
                        <StatusBadge status={previewCampaign.status} />
                    </div>
                    <iframe
                        ref={previewRef}
                        title="Email Preview"
                        style={{ width: '100%', height: 600, border: 'none', background: '#0a0e1a' }}
                    />
                </div>
            </div>
        );
    }

    /* ─── Create View ─── */
    if (view === 'create') {
        return (
            <div>
                <button
                    onClick={() => { setView('list'); resetForm(); }}
                    style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back to Campaigns
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* Left: Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ background: '#111827', borderRadius: 16, border: '1px solid #1f2937', padding: 24 }}>
                            <h3 style={{ margin: '0 0 20px', color: '#fff', fontSize: 18, fontWeight: 700 }}>Campaign Details</h3>

                            {error && (
                                <div style={{ background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Campaign Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. March Newsletter, Product Launch..."
                                    style={{ width: '100%', padding: '12px 16px', background: '#0a0e1a', border: '1px solid #374151', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Subject</label>
                                <input
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Subject line recipients will see"
                                    style={{ width: '100%', padding: '12px 16px', background: '#0a0e1a', border: '1px solid #374151', borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', color: '#9ca3af', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Target Audience</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {AUDIENCES.map(a => (
                                        <button
                                            key={a.value}
                                            onClick={() => setAudience(a.value)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: 10,
                                                border: `1px solid ${audience === a.value ? a.color : '#374151'}`,
                                                background: audience === a.value ? `${a.color}22` : '#0a0e1a',
                                                color: audience === a.value ? a.color : '#9ca3af',
                                                fontSize: 13,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <p style={{ margin: 0, color: '#6b7280', fontSize: 12 }}>
                                    Use <code style={{ color: '#60a5fa', background: '#1e3a5f', padding: '2px 6px', borderRadius: 4 }}>{'{{name}}'}</code> to personalize with recipient's name
                                </p>
                            </div>
                        </div>

                        {/* Template picker */}
                        <div style={{ background: '#111827', borderRadius: 16, border: '1px solid #1f2937', padding: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 700 }}>
                                    {useManual ? 'Manual HTML Editor' : 'Choose a Template'}
                                </h3>
                                <button
                                    onClick={() => useManual ? (() => { setUseManual(false); })() : handleSwitchToManual()}
                                    style={{
                                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                        background: useManual ? '#1e3a5f' : '#374151',
                                        border: `1px solid ${useManual ? '#3b82f6' : '#4b5563'}`,
                                        color: useManual ? '#60a5fa' : '#9ca3af',
                                    }}
                                >
                                    {useManual ? 'Use Template' : 'Write Manual HTML'}
                                </button>
                            </div>

                            {useManual ? (
                                <textarea
                                    value={htmlContent}
                                    onChange={e => setHtmlContent(e.target.value)}
                                    placeholder="Paste or write your HTML email here..."
                                    style={{
                                        width: '100%', minHeight: 350, padding: 16, background: '#0a0e1a', border: '1px solid #374151',
                                        borderRadius: 12, color: '#e5e7eb', fontSize: 13, fontFamily: 'monospace', lineHeight: 1.6,
                                        outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                                    }}
                                />
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    {templates.map(t => (
                                        <TemplateCard
                                            key={t.key}
                                            template={t}
                                            selected={selectedTemplate?.key === t.key}
                                            onClick={() => handleSelectTemplate(t)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Save button */}
                        <button
                            onClick={handleCreate}
                            disabled={saving}
                            style={{
                                width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
                                background: saving ? '#374151' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: '#fff', fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                                boxShadow: saving ? 'none' : '0 4px 15px rgba(59,130,246,0.3)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Campaign as Draft'}
                        </button>
                    </div>

                    {/* Right: Live Preview */}
                    <div style={{ background: '#111827', borderRadius: 16, border: '1px solid #1f2937', overflow: 'hidden', position: 'sticky', top: 24, height: 'fit-content' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                            <span style={{ color: '#6b7280', fontSize: 13, marginLeft: 8 }}>Live Preview</span>
                        </div>
                        {htmlContent ? (
                            <iframe
                                srcDoc={htmlContent.replace(/\{\{name\}\}/gi, 'John Doe').replace(/\{\{email\}\}/gi, 'john@example.com')}
                                title="Live Preview"
                                style={{ width: '100%', height: 580, border: 'none', background: '#0a0e1a' }}
                            />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: '#4b5563', fontSize: 14 }}>
                                Select a template or write HTML to see preview
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ─── List View ─── */
    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 700 }}>Email Campaigns</h2>
                    <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>Create and send email campaigns to your users</p>
                </div>
                <button
                    onClick={() => setView('create')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 24px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
                    }}
                >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New Campaign
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Total Campaigns', value: campaigns.length, color: '#3b82f6', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'Sent', value: campaigns.filter(c => c.status === 'sent').length, color: '#10b981', icon: 'M5 13l4 4L19 7' },
                    { label: 'Drafts', value: campaigns.filter(c => c.status === 'draft').length, color: '#f59e0b', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                    { label: 'Total Emails Sent', value: campaigns.reduce((s, c) => s + (c.sent_count || 0), 0), color: '#8b5cf6', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((stat, i) => (
                    <div key={i} style={{ background: '#111827', borderRadius: 16, border: '1px solid #1f2937', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={stat.color} strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                            <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 600 }}>{stat.label}</span>
                        </div>
                        <p style={{ margin: 0, color: '#fff', fontSize: 28, fontWeight: 800 }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Campaign List */}
            {campaigns.length === 0 ? (
                <div style={{ background: '#111827', borderRadius: 16, border: '1px solid #1f2937', padding: 60, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#60a5fa" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: 18 }}>No campaigns yet</h3>
                    <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: 14 }}>Create your first email campaign to engage with your users</p>
                    <button
                        onClick={() => setView('create')}
                        style={{
                            padding: '12px 24px', borderRadius: 12, border: 'none',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        Create Campaign
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {campaigns.map(c => (
                        <div key={c.id} style={{ background: '#111827', borderRadius: 16, border: '1px solid #1f2937', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                                    <h4 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 700 }}>{c.title}</h4>
                                    <StatusBadge status={c.status} />
                                </div>
                                <p style={{ margin: '0 0 4px', color: '#9ca3af', fontSize: 13 }}>
                                    Subject: <span style={{ color: '#d1d5db' }}>{c.subject}</span>
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                                    <span style={{ color: '#6b7280', fontSize: 12 }}>
                                        Audience: <span style={{ color: '#9ca3af', fontWeight: 600 }}>{AUDIENCES.find(a => a.value === c.audience)?.label || c.audience}</span>
                                    </span>
                                    {c.total_recipients > 0 && (
                                        <span style={{ color: '#6b7280', fontSize: 12 }}>
                                            Recipients: <span style={{ color: '#10b981', fontWeight: 600 }}>{c.sent_count}</span>
                                            {c.failed_count > 0 && <span style={{ color: '#ef4444' }}> / {c.failed_count} failed</span>}
                                            <span style={{ color: '#4b5563' }}> of {c.total_recipients}</span>
                                        </span>
                                    )}
                                    <span style={{ color: '#6b7280', fontSize: 12 }}>
                                        {c.sent_at ? `Sent ${new Date(c.sent_at).toLocaleDateString()}` : `Created ${new Date(c.created_at).toLocaleDateString()}`}
                                    </span>
                                    {c.created_by_name && (
                                        <span style={{ color: '#6b7280', fontSize: 12 }}>by {c.created_by_name}</span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                <button
                                    onClick={() => handlePreview(c)}
                                    style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #374151', background: '#1f2937', color: '#d1d5db', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Preview
                                </button>
                                {c.status === 'draft' && (
                                    <>
                                        <button
                                            onClick={() => handleSend(c.id)}
                                            disabled={sending === c.id}
                                            style={{
                                                padding: '8px 16px', borderRadius: 10, border: 'none',
                                                background: sending === c.id ? '#374151' : 'linear-gradient(135deg, #10b981, #059669)',
                                                color: '#fff', fontSize: 13, fontWeight: 600, cursor: sending === c.id ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {sending === c.id ? 'Sending...' : 'Send'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #7f1d1d', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
