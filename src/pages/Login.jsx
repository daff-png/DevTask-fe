import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../data/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            await login(email, password)
            const redirectTo = location.state?.from || '/'
            navigate(redirectTo, { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-ledger-bg flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8">
                <h1 className="font-display font-semibold text-2xl text-ledger-ink leading-none mb-1">
                    DevTask
                </h1>
                <p className="text-[10px] tracking-widest text-ledger-muted mb-8">
                    IT ENGINEERING LEDGER
                </p>

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-ledger-ink mb-1.5">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-ledger-ink/10 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-ledger-accent/30"
                        placeholder="you@devtask.com"
                        required
                    />

                    <label className="block text-sm font-medium text-ledger-ink mb-1.5">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-ledger-ink/10 rounded-lg px-3 py-2.5 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-ledger-accent/30"
                        placeholder=""
                        required
                    />
                    {error && <p className="text-xs text-red-500 mb-4 mt-1">{error}</p>}
                    {!error && <div className="mb-4" />}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-ledger-ink text-white text-sm font-medium py-2.5 rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
