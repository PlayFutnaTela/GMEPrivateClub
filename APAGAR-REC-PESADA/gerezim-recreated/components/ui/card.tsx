import React from 'react'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-slate-100 rounded-xl p-4 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
