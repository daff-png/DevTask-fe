import React, { createContext, useContext, useState, useEffect } from 'react'
import {
    fetchTasks,
    fetchStats,
    createTask,
    updateTaskApi,
    deleteTaskApi,
} from '../api/taskApi'

const TaskContext = createContext(null)

const CATEGORIES = ['Frontend', 'Backend', 'QA', 'DevOps']
const STATUSES = ['Pending', 'In Progress', 'Completed']

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([])
    const [stats, setStats] = useState({
        all: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadTasks = async () => {
        try {
            setLoading(true)
            coonst [tasksdata, statsData] = await Promise.all([fetchTasks(), fetchStats()])
            setTasks(tasksdata)
            setStats(statsData)
            setError(null)
        } catch (err) {
            setError('Failed to load tasks. Make sure the backend is running.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => loadTasks())
}
