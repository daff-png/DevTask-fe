import React from 'react';

const dotColor = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
}

const gradient = {
    blue: 'from-sky-200 via-indigo-200 to-fuchsia-200',
    pink: 'from-fuchsia-200 via-purple-200 to-indigo-200',
    violet: 'from-indigo-200 via-violet-200 to-purple-300',
    mint: 'from-emerald-200 via-teal-200 to-cyan-200',
}

export default function StatCard({ label, value, dot, tone}) {
    return (
        <div className="relative bg-white rounded-2xl p-5 shadow overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient[tone]} opacity-60`} />
            <div className="relative">
                <p className="text-sm font-medium text-ledger-ink/80">{label}</p>
                <div className="flex items-end gap-2 mt-3">
                    <span className={`text-4xl font-display font-semibold text-ledger-ink`}>{value}</span>
                    <span className={`w-2 h-2 rounded-full mb-2 ${dotColor[dot]}`} />
                </div>
            </div>
        </div>
    )
}