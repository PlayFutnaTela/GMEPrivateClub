import React from 'react'

export default function KpiCard({ title, value, hint, icon }: { title: string; value: string | number; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-start justify-between gap-4">
      <div>
        <div className="text-xs text-slate-500">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {hint && <div className="text-sm text-slate-400 mt-1">{hint}</div>}
      </div>
      {icon && <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">{icon}</div>}
    </div>
  )
}
