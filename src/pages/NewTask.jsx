import React from 'react'
import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/TaskForm.jsx'
import { useTasks } from '../data/TaskContext.jsx'
import { useNotifications } from '../data/NotificationContext.jsx'

export default function NewTask() {
  const { addTask } = useTasks()
  const { notify } = useNotifications()
  const navigate = useNavigate()

  return (
    <TaskForm
      eyebrow="Create Task"
      title="New Task"
      submitLabel="Add Task"
      onSubmit={async (form) => {
        try {
          await addTask(form)
          notify('Task added successfully.')
          navigate('/')
        } catch (err) {
          notify(err.response?.data?.message || 'Failed to add task', 'error')
        }
      }}
      onCancel={() => navigate('/')}
    />
  )
}