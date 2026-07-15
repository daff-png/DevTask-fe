import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TaskForm from '../components/TaskForm.jsx'
import { useTasks } from '../data/TaskContext.jsx'

export default function EditTask() {
    const { tasks, updateTask } = useTasks()
    const { id } = useParams()
    const navigate = useNavigate()
    const task = tasks.find((t) => t.id === Number(id))

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
            onSubmit={(form) => {
                updateTask(task.id, form)
                navigate('/')
            }}
            onCancel={() => navigate('/')}
        />
    )
}