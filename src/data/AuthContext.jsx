import React, { createContext, useContext, useState, useEffect, } from "react";
import { loginApi, getMeApi } from "../api/authApi.js";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('devtask_token'))
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            setLoading(false)
            return
        }
        getMeApi(token)
        .then((data) => setUser(data))
        .catch(() => {
            localStorage.removeItem('devtask_token')
            setToken(null)
        })
        .finally(() => setLoading(false))
    }, [token])

    const login = async (email, password) => {
        const data = await loginApi(email, password)
        localStorage.setItem('devtask_token', data.token)
        setToken(data.token)
        setUser(data.user)
    }

    const logout = () => {
        localStorage.removeItem('devtask_token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
    
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}