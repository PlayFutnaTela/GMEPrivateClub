"use client"
import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const OPTIONS = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: '90d', label: '90 dias' },
  { key: '365d', label: '365 dias' },
]

export default function PeriodSelector() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const current = searchParams.get('range') ?? '30d'

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRange = e.target.value
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('range', newRange)
    router.replace('/dashboard?' + params.toString())
  }

  return (
    <select value={current} onChange={onChange} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-sm">
      {OPTIONS.map((o) => (
        <option key={o.key} value={o.key}>{o.label}</option>
      ))}
    </select>
  )
}
