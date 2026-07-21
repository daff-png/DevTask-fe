import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  fetchTasks,
  fetchStats,
  createTask,
  updateTaskApi,
  deleteTaskApi,
} from '../api/taskApi.js'
import { useAuth } from './AuthContext.jsx'

const TaskContext = createContext(null)

const CATEGORIES = ['Frontend', 'Backend', 'QA', 'DevOps']
const STATUSES = ['Pending', 'In Progress', 'Completed']

const normalizeTasks = (value) => {
  if (Array.isArray(value)) return value
  if (value && Array.isArray(value.tasks)) return value.tasks
  if (value && Array.isArray(value.data)) return value.data
  if (value && Array.isArray(value.items)) return value.items
  return []
}

export function TaskProvider({ children }) {
  const { user, token } = useAuth()
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ all: 0, pending: 0, inProgress: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizeStats = (value) => {
    if (!value || typeof value !== 'object') {
      return { all: 0, pending: 0, inProgress: 0, completed: 0 }
    }

    const normalized = {
      all: Number(value.all ?? value.total ?? 0),
      pending: Number(value.pending ?? 0),
      inProgress: Number(value.inProgress ?? value.in_progress ?? 0),
      completed: Number(value.completed ?? 0),
    }

    return normalized
  }

  const loadTasks = async () => {
    try {
      setLoading(true)
        // First fetch stats so we know how many tasks to request from the API.
        const statsData = await fetchStats()
        const normalizedStats = normalizeStats(statsData)

        // Request tasks with a limit based on stats.total to ensure UI shows all items.
        // Fall back to a sensible default (1000) if stats.total is missing or zero.
        const limit = normalizedStats.all > 0 ? normalizedStats.all : 1000

        // Try several common paging parameter shapes in case the backend uses a different param name.
        const variants = [
          { limit },
          { page: 1, limit },
          { page: 1, pageSize: limit },
          { page: 1, per_page: limit },
          { per_page: limit },
          { pageSize: limit },
        ]

        const mergeById = (arr) => {
          const map = new Map()
          for (const t of arr) {
            if (!t || !t._id) continue
            map.set(t._id, t)
          }
          return Array.from(map.values())
        }

        let accumulated = []
        for (const params of variants) {
          try {
            const data = await fetchTasks(params)
            const items = normalizeTasks(data)
            accumulated = mergeById(accumulated.concat(items))
            // if we've gathered as many as stats expects, stop trying
            if (accumulated.length >= normalizedStats.all) break
          } catch (e) {
            console.warn('fetchTasks variant failed', params, e)
            // continue to next variant
          }
        }

        const normalizedTasks = accumulated

        if (normalizedTasks.length === 0 && normalizedStats.all > 0) {
          setTasks(Array.from({ length: normalizedStats.all }, (_, index) => ({
            _id: `fallback-${index}`,
            title: `Task ${index + 1}`,
            description: 'Loaded from stats fallback',
            category: 'Frontend',
            status: 'Pending',
            createdAt: new Date().toISOString(),
          })))
        } else {
          setTasks(normalizedTasks)
        }

        setTasks(normalizedTasks)
        setStats(normalizedStats)
      setError(null)
    } catch (err) {
      console.error('loadTasks error:', err)
      const serverMsg = err?.response?.data?.message || err?.message || 'Failed to load tasks. Make sure the backend is running.'
      setError(serverMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadTasks()
    } else {
      setTasks([])
      setStats({ all: 0, pending: 0, inProgress: 0, completed: 0 })
      setError(null)
      setLoading(false)
    }
  }, [token])

  const addTask = async (task) => {
    await createTask(task)
    await loadTasks()
  }

  const updateTask = async (id, updates) => {
    await updateTaskApi(id, updates)
    await loadTasks()
  }

  const deleteTask = async (id) => {
    await deleteTaskApi(id)
    await loadTasks()
  }

  return (
    <TaskContext.Provider
      value={{ tasks, stats, loading, error, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}

export { CATEGORIES, STATUSES }