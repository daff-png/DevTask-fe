import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../data/AuthContext.jsx'

const navItemBase =
  'w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors'

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 shrink-0 bg-white flex flex-col justify-between py-8 px-6 min-h-screen">
      <div>
        <div className="mb-10">
          <h1 className="font-display font-semibold text-2xl text-ledger-ink leading-none">
            DevTask
          </h1>
          <p className="text-[10px] tracking-widest text-ledger-muted mt-1">
            IT ENGINEERING LEDGER
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navItemBase} ${
                isActive
                  ? 'bg-white border border-ledger-ink/10 shadow text-ledger-ink'
                  : 'bg-ledger-panel text-ledger-ink/70 hover:bg-ledger-panel/70'
              }`
            }
          >
            <IconOverview />
            Overview
          </NavLink>

          {user?.role === 'PM' && (
            <NavLink
              to="/tasks/new"
              className={({ isActive }) =>
                `${navItemBase} ${
                  isActive
                    ? 'bg-white border border-ledger-ink/10 shadow text-ledger-ink'
                    : 'bg-ledger-panel text-ledger-ink/70 hover:bg-ledger-panel/70'
                }`
              }
            >
              <IconPlus />
              New Task
            </NavLink>
          )}
        </nav>
      </div>

      <div>
        <div className="flex items-center gap-3 bg-ledger-tan/60 rounded-xl px-3 py-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-white border border-ledger-ink/10" />
          <div className="leading-tight">
            <p className="text-[11px] text-ledger-muted">{user?.role}</p>
            <p className="text-sm font-medium text-ledger-ink">{user?.name}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-xs text-ledger-muted hover:text-ledger-ink text-center py-1"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}

function IconOverview() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}