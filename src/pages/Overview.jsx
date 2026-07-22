import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import { useTasks, CATEGORIES } from '../data/TaskContext.jsx'
import { useAuth } from '../data/AuthContext.jsx'
import { useNotifications } from '../data/NotificationContext.jsx'

const statusStyles = {
  Pending: 'text-yellow-600 bg-yellow-50',
  'In Progress': 'text-indigo-600 bg-indigo-50',
  Completed: 'text-green-600 bg-green-50',
}

export default function Overview() {
  const {
    tasks, stats, loading, error, deleteTask,
    category, changeCategory, page, setPage, pagination,
  } = useTasks()
  const { user } = useAuth()
  const { notify } = useNotifications()
  const isPM = user?.role === 'PM'
  const [taskToDelete, setTaskToDelete] = useState(null)
  const navigate = useNavigate()

  if (loading) {
    return <div className="flex-1 px-4 py-5 md:px-10 md:py-8"><p className="text-ledger-muted">Loading tasks...</p></div>
  }
  if (error) {
    return <div className="flex-1 px-4 py-5 md:px-10 md:py-8"><p className="text-red-500">{error}</p></div>
  }

  const currentPage = Math.min(Math.max(page, 1), pagination.totalPages)
  const pagedTasks = tasks.slice((currentPage - 1) * pagination.limit, currentPage * pagination.limit)
  const start = pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1
  const end = Math.min(currentPage * pagination.limit, pagination.total)

  return (
    <div className="flex-1 px-4 py-5 md:px-10 md:py-8">
      <PageHeader eyebrow="Dashboard" title="Overview" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6">
        <StatCard label="All Task" value={stats.all} dot="red" tone="blue" />
        <StatCard label="Pending" value={stats.pending} dot="yellow" tone="pink" />
        <StatCard label="In Progress" value={stats.inProgress} dot="indigo" tone="violet" />
        <StatCard label="Completed" value={stats.completed} dot="green" tone="mint" />
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            {isPM ? (
              <>
                <p className="text-sm font-medium text-ledger-ink mb-2">Category</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={category}
                    onChange={(e) => changeCategory(e.target.value)}
                    className="text-sm border border-ledger-ink/10 rounded-lg px-3 py-2 bg-white text-ledger-ink focus:outline-none focus:ring-2 focus:ring-ledger-accent/30"
                  >
                    <option>All Categories</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <span className="text-xs text-ledger-muted">
                    Showing {start}-{end} of {pagination.total}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-xs text-ledger-muted">
                Showing {start}-{end} of {pagination.total}
              </p>
            )}
          </div>

          {isPM && (
            <button
              onClick={() => navigate('/tasks/new')}
              className="flex items-center justify-center gap-1.5 bg-ledger-ink text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-black transition-colors"
            >
              <span className="text-lg leading-none">+</span> New Task
            </button>
          )}
        </div>

        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-ledger-muted border-b border-ledger-ink/5">
                <th className="py-2 font-medium">Task</th>
                <th className="py-2 font-medium">Category</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Created</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedTasks.map((task) => (
                <tr key={task._id} className="border-b border-ledger-ink/5 last:border-0">
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
                  <td className="py-4 text-ledger-ink/80">
                    {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-3">
                      {isPM ? (
                        <>
                          <button onClick={() => navigate(`/tasks/${task._id}/edit`)} className="text-ledger-ink/60 hover:text-ledger-ink">✎</button>
                          <button onClick={() => setTaskToDelete(task)} className="text-ledger-ink/60 hover:text-red-500">🗑</button>
                        </>
                      ) : (
                        <button onClick={() => navigate(`/tasks/${task._id}/edit`)} className="text-xs text-ledger-accent hover:underline">
                          Update Status
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pagedTasks.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-ledger-muted">No tasks assigned yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-ledger-ink/5">
            <p className="text-xs text-ledger-muted">Page {page} of {pagination.totalPages}</p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="text-sm font-medium px-3 py-1.5 rounded-lg border border-ledger-ink/10 text-ledger-ink disabled:opacity-30 hover:bg-ledger-panel">
                Prev
              </button>
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`text-sm font-medium w-8 h-8 rounded-lg ${page === i + 1 ? 'bg-ledger-ink text-white' : 'border border-ledger-ink/10 text-ledger-ink hover:bg-ledger-panel'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="text-sm font-medium px-3 py-1.5 rounded-lg border border-ledger-ink/10 text-ledger-ink disabled:opacity-30 hover:bg-ledger-panel">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isPM && (
        <DeleteModal
          task={taskToDelete}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={async () => {
            try {
              await deleteTask(taskToDelete._id)
              notify('Task deleted successfully.')
              setTaskToDelete(null)
            } catch (err) {
              notify(err.response?.data?.message || 'Failed to delete task', 'error')
            }
          }}
        />
      )}
    </div>
  )
}