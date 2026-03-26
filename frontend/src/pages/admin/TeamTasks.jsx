import React, { useState } from 'react';
import { api } from './api';
import useTeamData, { emptyTaskForm, statusOptions, priorityOptions } from './useTeamData';

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

export default function TeamTasks() {
    const { loading, saving, error, members, tasks, setTasks, runAction } = useTeamData();
    const [taskForm, setTaskForm] = useState(emptyTaskForm);

    const createTask = (e) => {
        e.preventDefault();
        runAction(
            () => api.post('/admin/team/tasks', {
                ...taskForm,
                assigneeUserId: Number(taskForm.assigneeUserId),
                dueDate: taskForm.dueDate || null
            }),
            () => setTaskForm(emptyTaskForm)
        );
    };

    const saveTask = (task) => runAction(() => api.patch(`/admin/team/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assigneeUserId: Number(task.assigneeUserId),
        dueDate: task.dueDate || null
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
                <h1 className="text-2xl font-bold text-white">Task Board</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Assign tasks to team members and manage the workflow from one place.
                </p>
                {error && <p className="text-sm font-semibold text-red-400 mt-2">{error}</p>}
            </div>

            <Section title="Assign New Task" subtitle="Tasks can be routed by admin and then updated by the assignee in their workspace.">
                <form onSubmit={createTask} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={taskForm.title} onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Task title" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <textarea value={taskForm.description} onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Task description" className="sm:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-28" />
                    <select value={taskForm.assigneeUserId} onChange={(e) => setTaskForm((prev) => ({ ...prev, assigneeUserId: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                        <option value="">Assign to...</option>
                        {members.filter((member) => member.isActive).map((member) => (
                            <option key={member.id} value={member.id}>{member.fullName}</option>
                        ))}
                    </select>
                    <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                    <select value={taskForm.priority} onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                        {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <select value={taskForm.status} onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                        {statusOptions.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}
                    </select>
                    <button disabled={saving} className="sm:col-span-2 rounded-xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold disabled:opacity-50">
                        {saving ? 'Saving...' : 'Create Task'}
                    </button>
                </form>
            </Section>

            <Section title="All Tasks" subtitle="Admins can rebalance assignments here; staff will see the same tasks inside their workspace.">
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <div key={task.id} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                                <input value={task.title} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, title: e.target.value } : item))} className="lg:col-span-2 rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                                <select value={task.assigneeUserId} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, assigneeUserId: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {members.filter((member) => member.isActive).map((member) => (
                                        <option key={member.id} value={member.id}>{member.fullName}</option>
                                    ))}
                                </select>
                                <input type="date" value={task.dueDate} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, dueDate: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none" />
                            </div>
                            <textarea value={task.description || ''} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none min-h-24" />
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                                <select value={task.status} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, status: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {statusOptions.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}
                                </select>
                                <select value={task.priority} onChange={(e) => setTasks((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, priority: e.target.value } : item))} className="rounded-xl px-4 py-3 bg-gray-950 text-white border border-gray-700 outline-none">
                                    {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                                <div className="rounded-xl px-4 py-3 bg-gray-950 border border-gray-700 text-sm text-gray-400">
                                    Created by {task.creator_name}
                                </div>
                                <button onClick={() => saveTask(task)} disabled={saving} className="rounded-xl px-4 py-3 bg-blue-600 text-white font-bold disabled:opacity-50">
                                    Save Task
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="rounded-2xl p-8 text-center text-sm font-medium text-gray-500" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
                            No tasks yet. Create one above.
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
