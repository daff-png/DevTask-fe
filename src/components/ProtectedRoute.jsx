import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../data/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, token, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen bg-ledger-bg flex items-center justify-center">
                <p className="text-ledger-muted text-sm">Loading...</p>
            </div>
        )
    }

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location.pathname }} />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return children
}