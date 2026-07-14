import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext(null);

const initialTasks = Array.from({ length: 4}).map((_, i) => ({
    id: i + 1,
    title: 'Fix Bug on Login Page',
    description: 'Session Tokens drops on Refresh!, users bounced to /login',
    category: 'Frontend',
    status: 'In progress',
    created: 'Jul 12'
}))

const CATEGORIES = ['Frontend', 'Backend', 'QA', 'DevOps']
const STATUSES = ['Pending', 'In progress', 'Completed']

export function TaskProvider({children}) {
    const [tasks, setTasks] = useState(initialTasks);

    const addTask = (task) => {
        setTasks((prev) => [{
            id: prev.length ? Math.max(...prev.map((t) => t.id)) +1 : 1,
            created: 'Jul 12',
            ...task,
        },
        ...prev,
    ])
    }

    const updateTask = (id, updates) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? {...t, ...updates} : t)))
    }

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    const stats = {
        all: tasks.length,
        pending: tasks.filter((t) => t.status === 'Pending').length,
        inProgress: tasks.filter((t) => t.status === 'In progress').length,
        completed: tasks.filter((t) => t.status === 'Completed').length,
    }

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, stats }}>
            {children}
        </TaskContext.Provider>
    )
}

export function useTasks() {
    const ctx = useContext(TaskContext)
    if (!ctx) throw new Error('useTasks must be used within a TaskProvider')
    return ctx
}

export {CATEGORIES, STATUSES}