import React, { useState } from 'react'
import PageHeader from './PageHeader.jsx'
import { CATEGORIES, STATUSES } from '../data/TaskContext.jsx'
import { useAuth } from '../data/AuthContext.jsx'

export default function TaskForm({ eyebrow, title, initial, submitLabel, onSubmit, onCancel }) {
  const { user } = useAuth()
  const isPM = user?.role === 'PM'
  const [form, setForm] = useState(
    initial ?? { title: '', description: '', category: 'Frontend', status: 'Pending' }
  )
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isPM && !form.title.trim()) {
      setError(true)
      return
    }
    onSubmit(form)
  }

  return (
    <div className="flex-1 px-10 py-8">
      <PageHeader eyebrow={eyebrow} title={title} />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 max-w-xl">
        <label className="block text-sm font-medium text-ledger-ink mb-1.5">
          Title{isPM && <span className="text-red-500">*</span>}
        </label>
        <input
          value={form.title}
          onChange={(e) => {
            setForm({ ...form, title: e.target.value })
            if (error) setError(false)
          }}
          disabled={!isPM}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-ledger-accent/30 disabled:bg-ledger-panel/60 disabled:text-ledger-ink/60 ${
            error ? 'border-red-400' : 'border-ledger-ink/10'
          }`}
        />
        {error && <p className="text-xs text-red-500 mb-4">Title is required.</p>}
        {!error && <div className="mb-4" />}

        <label className="block text-sm font-medium text-ledger-ink mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={!isPM}
          rows={4}
          className="w-full border border-ledger-ink/10 rounded-lg px-3 py-2.5 text-sm mb-5 bg-ledger-panel/40 focus:outline-none focus:ring-2 focus:ring-ledger-accent/30 resize-none disabled:text-ledger-ink/60"
        />

        <p className="text-sm font-medium text-ledger-ink mb-2">Category</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map((c) => (
            <PillButton key={c} active={form.category === c} disabled={!isPM} onClick={() => isPM && setForm({ ...form, category: c })}>
              {c}
            </PillButton>
          ))}
        </div>

        <p className="text-sm font-medium text-ledger-ink mb-2">Status</p>
        <div className="flex flex-wrap gap-2 mb-7">
          {STATUSES.map((s) => (
            <PillButton key={s} active={form.status === s} onClick={() => setForm({ ...form, status: s })}>
              {s}
            </PillButton>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-ledger-ink text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-black transition-colors">
            {submitLabel}
          </button>
          <button type="button" onClick={onCancel} className="border border-ledger-ink/15 text-sm font-medium px-5 py-2.5 rounded-lg text-ledger-ink hover:bg-ledger-panel transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function PillButton({ active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? 'bg-ledger-accent text-white' : 'bg-ledger-panel text-ledger-ink/70 hover:bg-ledger-panel/70'
      }`}
    >
      {children}
    </button>
  )
}