import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { CATEGORIES, STATUSES } from '../data/TaskContext';

export default function TaskForm({ eyebrow, title, initial, submitLabel, onSubmit, onCancel }) {
    const [form, setForm] = useState(
        initial ?? { title: '', description: '', category: 'Frontend', status: 'Pending' }
    )
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.title.trim()) {
            setError(true)
            return
        }
        onSubmit(form)
    }
    return (
        <div className="flex-1 px-10 py-8">
            <PageHeader eyebrow={eyebrow} title={title} />

            <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow p-6 max-w-xl'>
                <label className="block text-sm font-medium text-ledger-ink mb-1 5">
                    Title<span className="text-red-500"></span>
                </label>
                <input value={form.title} onChange={(e) => {
                    setForm({ ...form, title: e.target.value })
                    if (error) setError(false)
                }}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-ledger-accent/30 ${error ? 'border-red-400' : 'border-ledger-ink/10'
                        }`}
                    placeholder="e.g. Fix bug on login page"
                />
                {error && <p className="text-xs text-red-500 mb-4">Title is required</p>}
                {!error && <div className="mb-4" />}

                <label className="block text-sm font-medium text-ledger-ink mb-1 5">
                    Desription
                </label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full border border-ledger-ink/10 rounded-lg px-3 py-2.5 text-sm mb-5 bg-ledger-panel/40 focus:outline-none focus:ring-2 focus:ring-ledger-accent/30 resize-none" placeholder="What's the task about?"
                />

                <p className="text-sm font-medium text-ledger-ink mb-2">Category</p>
                <div className="flex flex-wrap gap-2 mb-5">
                    {CATEGORIES.map((c) => (
                        <PillButton key={c} active={form.category === c} onClick={() => setForm({ ...form, category: c })}>{c}</PillButton>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="bg-ledger-ink text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-black transition-colors">
                        {submitLabel}
                    </button>
                    <button type="button" onClick={onCancel} className="border border-ledger-ink/15 text-sm font-medium px-5
                    py-2.5 rounded-lg text-ledger-ink gover:bg-ledger-panel transition-colors">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

function PillButton({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${active ? 'bg-ledger-accent text-white' : 'bg-ledger-panel text-ledger-ink/70 hover:bg-ledger-panel/70'
                }`}
        >
            {children}
        </button>
    )
}