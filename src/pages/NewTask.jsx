import React from 'react'
import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm.jsx'
import { useTasks } from '../data/TaskContext.jsx'

export default function NewTask() {
    const { addTask } = useTasks()
    const navigate = useNavigate()

    return (
        <TaskForm eyebrow="Create Task" title="New Task" submitLabel="Add Task" onSubmit={(form) => {addTask(form) 
        navigate('/')}}/>
    )
}