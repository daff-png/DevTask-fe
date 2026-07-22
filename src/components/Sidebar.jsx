import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../data/AuthContext.jsx'
import { useNotifications } from '../data/NotificationContext.jsx'

const navItemBase =
  'w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { notify } = useNotifications()
  const [open, setOpen] = useState(false)

  const content = (
    <>
      <div>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-2xl text-ledger-ink leading-none">
              DevTask
            </h1>
            <p className="text-[10px] tracking-widest text-ledger-muted mt-1">
              IT ENGINEERING LEDGER
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-ledger-ink/60 text-2xl leading-none"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/"
            end
            onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
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
          onClick={() => {
            logout()
            notify('Logged out successfully.')
          }}
          className="w-full text-xs text-ledger-muted hover:text-ledger-ink text-center py-1"
        >
          Log out
        </button>
      </div>
    </>
  )

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3">
        <h1 className="font-display font-semibold text-xl text-ledger-ink leading-none">
          DevTask
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="text-ledger-ink text-2xl leading-none"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[80%] bg-white flex flex-col justify-between py-6 px-5 h-full overflow-y-auto">
            {content}
          </aside>
        </div>
      )}

      <aside className="hidden md:flex w-64 shrink-0 bg-white flex-col justify-between py-8 px-6 min-h-screen">
        {content}
      </aside>
    </>
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