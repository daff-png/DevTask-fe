import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import NewTask from './pages/NewTask.jsx'
import EditTask from './pages/EditTask.jsx'
import { TaskProvider } from './data/TaskContext.jsx'

export default function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-ledger-bg relative">
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/tasks/new" element={<NewTask />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
          </Routes>
        </main>
      </div>
    </TaskProvider>
  )
}
