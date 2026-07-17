import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TaskForm from '../components/TaskForm.jsx'
import { useTasks } from '../data/TaskContext.jsx'

export default function EditTask() {
    const { tasks, updateTask, loading } = useTasks()
    const { id } = useParams()
    const navigate = useNavigate()
    const task = tasks.find((t) => t._id === id)

    if (loading) {
        return (
            <div className="flex-1 px-10 py-8">
                <p className="text-ledger-muted">Loading task...</p>
            </div>
        )
    }

    if (!task) {
        return (
            <div className="flex-1 px-10 py-8">
                <p className="text-ledger-muted">Task not found</p>
            </div>
        )
    }

    return (
        <TaskForm
            eyebrow="Revise Task"
            title="Edit Task"
            initial={task}
            submitLabel="Save Changes"
            onSubmit={async (form) => {
                await updateTask(task._id, form)
                navigate('/')
            }}
            onCancel={() => navigate('/')}
        />
    )
}