import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import { useTasks, CATEGORIES } from '../data/TaskContext.jsx'

const statusStyles = {
    Pending: 'text-yellow-600 bg-yellow-50',
    'In Progress': 'text-indigo-600 bg-indigo-50',
    Completed: 'text-green-600 bg-green-50',
}

export default function Overview() {
    const { tasks, stats, deleteTask } = useTasks()
    const [category, setCategory] = useState('All Categories')
    const [taskToDelete, setTaskToDelete] = useState(null)
    const navigate = useNavigate()

    const filtered = category === 'All Categories' ? tasks : tasks.filter((t) => t.category === category)

    return (
        <div className="flex-1 px-10 py-8">
            <PageHeader eyebrow="Dashboard" title="Overview" />

            <div className="grid grid-cols-4 gap-5 mb-6">
                <StatCard label="All Task" value={stats.all} dot="red" tone="blue" />
                <StatCard label="Pending" value={stats.pending} dot="yellow" tone="pink" />
                <StatCard label="In Progress" value={stats.inProgress} dot="indigo" tone="violet" />
                <StatCard label="Completed" value={stats.completed} dot="green" tone="mint" />
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-sm font-medium text-ledger-ink mb-2">Category</p>
                        <div className="flex items-center gap-3">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="text-sm border border-ledger-ink/10 rounded-lg px-3 py-2 bg-white text-ledger-ink focus:outline-none focus:ring-2 focus:ring-ledger-accent/30"
                            >
                                <option>All Categories</option>
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                            <span className="text-xs text-ledger-muted">
                                Showing {filtered.length} of {tasks.length}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/tasks/new')}
                        className="flex items-center gap-1.5 bg-ledger-ink text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-black transition-colors"
                    >
                        <span className="text-lg leading-none">+</span> New Task
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-ledger-muted border-b border-ledger-ink/5">
                                <th className="py-2 font-medium">Task</th>
                                <th className="py-2 font-medium">Category</th>
                                <th className="py-2 font-medium">Status</th>
                                <th className="py-2 font-medium">Created</th>
                                <th className="py-2 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="task-scroll">
                            {filtered.map((task) => (
                                <tr key={task.id} className="border-b border-ledger-ink/5 last:border-0">
                                    <td className="py-4 pr-4 max-w-sm">
                                        <p className="font-medium text-ledger-ink">{task.title}</p>
                                        <p className="text-xs text-ledger-muted mt-0.5">{task.description}</p>
                                    </td>
                                    <td className="py-4 text-ledger-ink/80">{task.category}</td>
                                    <td className="py-4">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[task.status]}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-ledger-ink/80">{task.created}</td>
                                    <td className="py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => navigate(`/tasks/${task.id}/edit`)} aria-label="Edit task" className="text-ledger-ink/60 hover:text-ledger-ink">
                                                ✎
                                            </button>
                                            <button onClick={() => setTaskToDelete(task)} aria-label="Delete task" className="text-ledger-ink/60 hover:text-red-500">
                                                🗑
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-ledger-muted">
                                        No tasks in this category yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteModal
                task={taskToDelete}
                onCancel={() => setTaskToDelete(null)}
                onConfirm={() => {
                    deleteTask(taskToDelete.id)
                    setTaskToDelete(null)
                }}
            />
        </div>
    )
}