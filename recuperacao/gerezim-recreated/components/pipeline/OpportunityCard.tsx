"use client"
import React from 'react'

export default function OpportunityCard({ opp }: { opp: any }) {
  return (
    <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm cursor-grab">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">{opp.title ?? '—'}</div>
          <div className="text-xs text-slate-500 mt-1">{opp.customer_name ?? opp.client ?? 'Cliente não informado'}</div>
        </div>

        <div className="text-right text-sm font-semibold">{opp.value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: opp.currency ?? 'BRL' }).format(opp.value) : '—'}</div>
      </div>

      <div className="mt-2 text-xs text-slate-500">{opp.summary ?? opp.description ?? ''}</div>
    </div>
  )
}
