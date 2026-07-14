import React from 'react';

export default function DeleteModal({ task, onCancel, onConfirm }) {
    if (!task) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded 2xl shadow-xl w-full max-w-sm p-6">
                <h3 className="font-display font-semibold text-lg text-ledger-ink mb-2">
                    Delete This Task?
                </h3>
                <p className="text-sm text-ledger-muted mb-6">
                    <span className="font-medium text-ledger-ink">{task.title}</span> Will be removed from the ledger. This Can't be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onConfirm} className="flex-1 bg-ledger-ink text-white text-sm font-medium py-2.5 rounded-lg hover:bg-black transition-colors">
                        Delete Task
                    </button>
                    <button onClick={onCancel} className="flex-1 border border-ledger-ink/15 text-sm font-medium py-2.5 rounded-lg text-ledger-ink hover:bg-ledger-panel transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}