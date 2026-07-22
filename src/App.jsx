import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import NewTask from './pages/NewTask.jsx'
import EditTask from './pages/EditTask.jsx'
import Login from './pages/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { TaskProvider } from './data/TaskContext.jsx'
import { AuthProvider } from './data/AuthContext.jsx'
import { NotificationProvider } from './data/NotificationContext.jsx'

function Layout({ children }) {
  return (
      <div className="min-h-screen bg-ledger-bg flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-ledger-panel min-h-screen">{children}</main>
      </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <TaskProvider>
                  <Layout>
                    <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route
                      path="/tasks/new"
                      element={
                        <ProtectedRoute allowedRoles={['PM']}>
                          <NewTask />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/tasks/:id/edit" element={<EditTask />} />
                  </Routes>
                </Layout>
              </TaskProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
      </NotificationProvider>
    </AuthProvider>
  )
}