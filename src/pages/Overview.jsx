import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import { useTasks, CATEGORIES } from '../data/TaskContext.jsx'
import { useAuth } from '../data/AuthContext.jsx'

const statusStyles = {
  Pending: 'text-yellow-600 bg-yellow-50',
  'In Progress': 'text-indigo-600 bg-indigo-50',
  Completed: 'text-green-600 bg-green-50',
}

export default function Overview() {
  const { tasks, stats, loading, error, deleteTask, updateTask } = useTasks()
  const { user } = useAuth()
  const isPM = user?.role === 'PM'
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const navigate = useNavigate()

  const taskList = Array.isArray(tasks) ? tasks : []
  const matchesAssignee = (task, currentUser) => {
    if (!task || !currentUser) return false
    const normalizedRole = String(currentUser.role ?? '').trim().toLowerCase()
    if (task.category && String(task.category).trim().toLowerCase() === normalizedRole) {
      return true
    }
    const assignee =
      task.assignee ??
      task.assignees ??
      task.assignedTo ??
      task.assigned_to ??
      task.assigned ??
      task.assigned_user ??
      task.assigneeId ??
      task.assignee_id ??
      task.owner ??
      task.ownerId ??
      task.owner_id ??
      task.user ??
      task.userId

    const checkValue = (value) => {
      if (!value) return false
      if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase()
        return (
          value === currentUser._id ||
          value === currentUser.id ||
          value === currentUser.email ||
          normalizedValue === normalizedRole
        )
      }
      if (typeof value === 'object') {
        return (
          value._id === currentUser._id ||
          value.id === currentUser.id ||
          value.email === currentUser.email ||
          String(value.role ?? value.category ?? '').trim().toLowerCase() === normalizedRole
        )
      }
      return false
    }

    if (Array.isArray(assignee)) {
      return assignee.some((entry) => checkValue(entry))
    }

    return checkValue(assignee)
  }

  const visibleTasks = isPM ? taskList : taskList.filter((task) => matchesAssignee(task, user))
  const filteredTasks =
    selectedCategory === 'All Categories'
      ? visibleTasks
      : visibleTasks.filter((task) => task.category === selectedCategory)
  const safeStats = isPM
    ? stats || { all: 0, pending: 0, inProgress: 0, completed: 0 }
    : filteredTasks.reduce(
        (acc, task) => {
          acc.all += 1
          if (task.status === 'Pending') acc.pending += 1
          if (task.status === 'In Progress') acc.inProgress += 1
          if (task.status === 'Completed') acc.completed += 1
          return acc
        },
        { all: 0, pending: 0, inProgress: 0, completed: 0 }
      )
  const pageSize = 5
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const pageTasks = filteredTasks.slice(startIndex, startIndex + pageSize)

  const handlePageChange = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setCurrentPage(nextPage)
    }
  }

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (loading) {
    return <div className="flex-1 px-10 py-8"><p className="text-ledger-muted">Loading tasks...</p></div>
  }
  if (error) {
    return <div className="flex-1 px-10 py-8"><p className="text-red-500">{error}</p></div>
  }

  const start = filteredTasks.length === 0 ? 0 : startIndex + 1
  const end = Math.min(startIndex + pageSize, filteredTasks.length)

  return (
    <div className="flex-1 px-10 py-8">
      <PageHeader eyebrow="Dashboard" title="Overview" />

      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard label="All Task" value={safeStats.all ?? 0} dot="red" tone="blue" />
        <StatCard label="Pending" value={safeStats.pending ?? 0} dot="yellow" tone="pink" />
        <StatCard label="In Progress" value={safeStats.inProgress ?? 0} dot="indigo" tone="violet" />
        <StatCard label="Completed" value={safeStats.completed ?? 0} dot="green" tone="mint" />
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-3">
              {isPM ? (
                <>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="text-sm border border-ledger-ink/10 rounded-lg px-3 py-2 bg-white text-ledger-ink focus:outline-none focus:ring-2 focus:ring-ledger-accent/30"
                  >
                    <option>All Categories</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <span className="text-xs text-ledger-muted">
                    Showing {start}-{end} of {filteredTasks.length}
                  </span>
                </>
              ) : (
                <span className="text-xs text-ledger-muted">Showing {start}-{end} of {filteredTasks.length}</span>
              )}
            </div>
          </div>

          {isPM && (
            <button
              onClick={() => navigate('/tasks/new')}
              className="flex items-center gap-1.5 bg-ledger-ink text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-black transition-colors"
            >
              <span className="text-lg leading-none">+</span> New Task
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ledger-muted border-b border-ledger-ink/5">
                <th className="py-2 font-medium">Task</th>
                {isPM && <th className="py-2 font-medium">Category</th>}
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Created</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageTasks.map((task) => (
                <tr key={task._id} className="border-b border-ledger-ink/5 last:border-0">
                  <td className="py-4 pr-4 max-w-sm">
                    <p className="font-medium text-ledger-ink">{task.title}</p>
                    <p className="text-xs text-ledger-muted mt-0.5">{task.description}</p>
                  </td>
                  {isPM && <td className="py-4 text-ledger-ink/80">{task.category}</td>}
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
                        <button
                          onClick={async () => {
                            if (updatingTaskId) return
                            setUpdatingTaskId(task._id)
                            try {
                              const nextStatus = task.status === 'Pending' ? 'In Progress' : 'Completed'
                              await updateTask(task._id, { status: nextStatus })
                            } catch (err) {
                              // show server message if available
                              const msg = err?.response?.data?.message || err.message || 'Update failed'
                              // 403 indicates permission issue
                              if (err?.response?.status === 403) {
                                alert('You are not authorized to update this task: ' + msg)
                              } else {
                                alert('Failed to update task: ' + msg)
                              }
                            } finally {
                              setUpdatingTaskId(null)
                            }
                          }}
                          disabled={updatingTaskId === task._id}
                          className="text-xs text-ledger-accent hover:underline disabled:opacity-50"
                        >
                          {updatingTaskId === task._id ? 'Updating…' : 'Update Status'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-ledger-muted">No tasks assigned yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-ledger-ink/5">
          <p className="text-xs text-ledger-muted">
            Page {safePage} of {totalPages} · {filteredTasks.length} tasks
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-ledger-ink/10 text-ledger-ink disabled:opacity-30 hover:bg-ledger-panel"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`text-sm font-medium w-8 h-8 rounded-lg ${safePage === i + 1 ? 'bg-ledger-ink text-white' : 'border border-ledger-ink/10 text-ledger-ink hover:bg-ledger-panel'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-ledger-ink/10 text-ledger-ink disabled:opacity-30 hover:bg-ledger-panel"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isPM && (
        <DeleteModal
          task={taskToDelete}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={async () => {
            await deleteTask(taskToDelete._id)
            setTaskToDelete(null)
          }}
        />
      )}
    </div>
  )
}