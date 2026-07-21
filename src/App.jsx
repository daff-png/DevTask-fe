import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Overview from './pages/Overview.jsx'
import NewTask from './pages/NewTask.jsx'
import EditTask from './pages/EditTask.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './data/AuthContext.jsx'

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-ledger-bg flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-ledger-bg flex items-center justify-center">
        <p className="text-ledger-muted text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <Overview />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/new"
        element={
          <ProtectedRoute allowedRoles={['PM']}>
            <AppShell>
              <NewTask />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['PM']}>
            <AppShell>
              <EditTask />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  )
}