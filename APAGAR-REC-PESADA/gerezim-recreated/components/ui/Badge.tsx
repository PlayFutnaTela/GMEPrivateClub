import React from 'react'

export function Badge({ children, status }: { children: React.ReactNode; status?: 'quente' | 'morno' | 'frio' }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold'
  const cls = status === 'quente' ? 'bg-red-600 text-white' : status === 'morno' ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'
  return <span className={`${base} ${cls}`}>{children}</span>
}
