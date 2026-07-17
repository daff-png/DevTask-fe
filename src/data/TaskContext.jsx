import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  fetchTasks,
  fetchStats,
  createTask,
  updateTaskApi,
  deleteTaskApi,
} from '../api/taskApi.js'

const TaskContext = createContext(null)

const CATEGORIES = ['Frontend', 'Backend', 'QA', 'DevOps']
const STATUSES = ['Pending', 'In Progress', 'Completed']

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ all: 0, pending: 0, inProgress: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      const [tasksData, statsData] = await Promise.all([fetchTasks(), fetchStats()])
      setTasks(tasksData)
      setStats(statsData)
      setError(null)
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

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