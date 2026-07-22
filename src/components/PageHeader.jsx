import React, { useEffect, useState } from 'react';

export default function PageHeader({ eyebrow, title }) {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(t)
    }, [])

    const time = now.toTimeString().slice(0, 5)
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

    return (
        <div className="flex items-start justify-between mb-5 md:mb-8">
            <div>
                <p className="text-xs text-ledger-muted mb-1">{eyebrow}</p>
                <h2 className="font-display font-semibold text-xl md:text-3xl text-ledger-ink">{title}</h2>
            </div>
            <div className="text-right text-xs text-ledger-muted leading-tight pt-1">
                <p>{time}</p>
                <p>{date}</p>
            </div>
        </div>
    )
}