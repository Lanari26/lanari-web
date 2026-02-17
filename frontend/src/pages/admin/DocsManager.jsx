import { useState, useEffect } from 'react';
import { api } from './api';

function renderPreview(text) {
    if (!text) return '';
    return text
        .replace(/^#### (.+)$/gm, '<h4 class="text-sm font-bold text-gray-200 mt-3 mb-1">$1</h4>')
        .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-5 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-2">$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-200 font-semibold">$1</strong>')
        .replace(/^- (.+)$/gm, '<div class="flex gap-2 ml-1 mb-1"><span class="text-blue-400 flex-shrink-0">&#9679;</span><span class="text-gray-400">$1</span></div>')
        .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 ml-1 mb-1"><span class="text-blue-400 font-bold min-w-[16px]">$1.</span><span class="text-gray-400">$2</span></div>')
        .replace(/\n\n/g, '</p><p class="text-gray-400 leading-relaxed mb-2">')
        .replace(/\n/g, '<br/>');
}

export default function DocsManager() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', category: '', content: '', icon: '📄', sortOrder: 0, isPublished: true });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('edit'); // 'edit' or 'preview'
    const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'

    const load = () => {
        api.get('/docs/admin/all')
            .then(res => setDocs(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const existingCategories = [...new Set(docs.map(d => d.category))].sort();

    const filteredDocs = docs.filter(d => {
        if (filter === 'published') return d.is_published;
        if (filter === 'draft') return !d.is_published;
        return true;
    });

    const startCreate = () => {
        setForm({ title: '', category: '', content: '', icon: '📄', sortOrder: 0, isPublished: true });
        setEditing('new');
        setTab('edit');
        setError('');
    };

    const startEdit = (doc) => {
        setForm({
            title: doc.title,
            category: doc.category,
            content: doc.content,
            icon: doc.icon || '📄',
            sortOrder: doc.sort_order || 0,
            isPublished: !!doc.is_published
        });
        setEditing(doc);
        setTab('edit');
        setError('');
    };

    const cancel = () => {
        setEditing(null);
        setError('');
    };

    const save = async () => {
        if (!form.title.trim() || !form.category.trim() || !form.content.trim()) {
            setError('Title, category, and content are required');
            return;
        }
        setSaving(true);
        setError('');
        try {
            if (editing === 'new') {
                await api.post('/docs', form);
            } else {
                await api.put(`/docs/${editing.id}`, form);
            }
            setEditing(null);
            setLoading(true);
            load();
        } catch (err) {
            setError(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete this document permanently?')) return;
        try {
            await api.del(`/docs/${id}`);
            setDocs(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            alert(err.message || 'Failed to delete');
        }
    };

    const togglePublished = async (doc) => {
        try {
            await api.put(`/docs/${doc.id}`, { isPublished: !doc.is_published });
            setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, is_published: !d.is_published } : d));
        } catch (err) {
            alert(err.message || 'Failed to update');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    // ─── Editor View ──────────────────────────────────────
    if (editing) {
        return (
            <div className="space-y-5 max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={cancel} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-bold text-white">
                            {editing === 'new' ? 'New Document' : 'Edit Document'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={cancel} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            Discard
                        </button>
                        <button
                            onClick={save}
                            disabled={saving}
                            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {saving ? 'Saving...' : (editing === 'new' ? 'Publish' : 'Save Changes')}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-400 text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Form fields */}
                <div className="p-5 rounded-2xl" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Document title"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white text-sm focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                            <input
                                type="text"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                placeholder="e.g. Getting Started, Products"
                                list="doc-categories"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white text-sm focus:border-blue-500 outline-none transition-colors"
                            />
                            <datalist id="doc-categories">
                                {existingCategories.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Icon (emoji)</label>
                            <input
                                type="text"
                                value={form.icon}
                                onChange={e => setForm({ ...form, icon: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white text-sm focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sort Order</label>
                            <input
                                type="number"
                                value={form.sortOrder}
                                onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white text-sm focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 cursor-pointer w-full hover:border-gray-600 transition-colors">
                                <div className={`w-9 h-5 rounded-full relative transition-colors ${form.isPublished ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isPublished ? 'left-4' : 'left-0.5'}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-300">{form.isPublished ? 'Published' : 'Draft'}</span>
                                <input
                                    type="checkbox"
                                    checked={form.isPublished}
                                    onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Content editor with preview tabs */}
                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                    <div className="flex items-center border-b border-gray-700/50 px-1 pt-1">
                        <button
                            onClick={() => setTab('edit')}
                            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all ${
                                tab === 'edit' ? 'bg-gray-900/50 text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Write
                            </span>
                        </button>
                        <button
                            onClick={() => setTab('preview')}
                            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all ${
                                tab === 'preview' ? 'bg-gray-900/50 text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Preview
                            </span>
                        </button>
                    </div>
                    {tab === 'edit' ? (
                        <textarea
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            placeholder={"## Section Title\n\nWrite your documentation content here...\n\n- List item 1\n- List item 2\n\n**Bold text** for emphasis\n\n### Subsection\n\n1. Numbered step\n2. Another step"}
                            rows={20}
                            className="w-full px-5 py-4 bg-transparent text-white text-sm focus:outline-none font-mono leading-relaxed resize-y min-h-[400px]"
                        />
                    ) : (
                        <div className="px-6 py-5 min-h-[400px] overflow-y-auto">
                            {form.content ? (
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{form.icon}</span>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">{form.title || 'Untitled'}</h1>
                                        <span className="text-xs font-medium text-blue-400">{form.category || 'No category'}</span>
                                    </div>
                                </div>
                            ) : null}
                            {form.content ? (
                                <div
                                    className="text-gray-400 text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: '<p class="text-gray-400 leading-relaxed mb-2">' + renderPreview(form.content) + '</p>' }}
                                />
                            ) : (
                                <p className="text-gray-600 text-sm italic">Nothing to preview. Start writing in the editor.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── List View ────────────────────────────────────────
    const publishedCount = docs.filter(d => d.is_published).length;
    const draftCount = docs.length - publishedCount;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex rounded-xl overflow-hidden border border-gray-700">
                        {[
                            { key: 'all', label: `All (${docs.length})` },
                            { key: 'published', label: `Published (${publishedCount})` },
                            { key: 'draft', label: `Drafts (${draftCount})` },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    filter === f.key ? 'bg-blue-500/15 text-blue-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={startCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-500/10"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New Document
                </button>
            </div>

            {/* Docs list */}
            {filteredDocs.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl">
                        📄
                    </div>
                    <p className="text-gray-400 font-semibold">
                        {filter === 'draft' ? 'No draft documents' : filter === 'published' ? 'No published documents' : 'No documents yet'}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                        {docs.length === 0 ? 'Create your first documentation article' : 'Try changing the filter'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredDocs.map(doc => (
                        <div
                            key={doc.id}
                            className="rounded-2xl p-5 transition-all hover:bg-gray-800/80 cursor-pointer"
                            style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                            onClick={() => startEdit(doc)}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700/50 flex items-center justify-center text-lg flex-shrink-0">
                                    {doc.icon}
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-bold text-white truncate">{doc.title}</span>
                                        {!doc.is_published && (
                                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full flex-shrink-0">DRAFT</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{doc.category}</span>
                                        <span className="text-gray-600">{doc.content.replace(/[#*\-\n]/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 60)}...</span>
                                    </div>
                                </div>

                                {/* Date */}
                                <span className="text-xs text-gray-600 flex-shrink-0 hidden sm:block">
                                    {new Date(doc.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => togglePublished(doc)}
                                        className={`p-2 rounded-lg transition-colors ${doc.is_published ? 'text-green-400/60 hover:text-green-400 hover:bg-green-500/10' : 'text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10'}`}
                                        title={doc.is_published ? 'Unpublish' : 'Publish'}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            {doc.is_published
                                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            }
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => startEdit(doc)}
                                        className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => remove(doc.id)}
                                        className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
