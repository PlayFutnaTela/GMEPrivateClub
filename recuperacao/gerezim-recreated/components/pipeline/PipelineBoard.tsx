"use client"
import React, { useMemo, useState } from 'react'
import OpportunityCard from './OpportunityCard'
import { supabaseClient } from '../../lib/supabase/client'
import { toast, Toaster } from 'sonner'

const STAGES: { key: string; label: string }[] = [
  { key: 'novo', label: 'Novo' },
  { key: 'interessado', label: 'Interessado' },
  { key: 'proposta_enviada', label: 'Proposta enviada' },
  { key: 'negociacao', label: 'Negociação' },
  { key: 'finalizado', label: 'Finalizado' },
]

export default function PipelineBoard({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [cols, setCols] = useState<Record<string, any[]>>(() => {
    const map: Record<string, any[]> = {}
    STAGES.forEach(s => map[s.key] = [])
    (initialOpportunities ?? []).forEach((o) => {
      const stage = (o.pipeline_stage ?? 'novo')
      if (!map[stage]) map[stage] = []
      map[stage].push(o)
    })
    return map
  })

  const [draggingId, setDraggingId] = useState<string | null>(null)

  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData('text/plain', id)
    setDraggingId(id)
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  async function onDrop(e: React.DragEvent, targetStage: string) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return

    // find origin stage
    let originStage: string | null = null
    for (const k of Object.keys(cols)) {
      if (cols[k].some((i) => String(i.id) === String(id))) { originStage = k; break }
    }
    if (!originStage) return
    if (originStage === targetStage) { setDraggingId(null); return }

    // optimistic update
    const moving = cols[originStage].find((i) => String(i.id) === String(id))
    setCols((prev) => {
      const next = { ...prev }
      next[originStage] = prev[originStage].filter((i) => String(i.id) !== String(id))
      next[targetStage] = [moving, ...prev[targetStage]]
      return next
    })

    // persist to supabase
    try {
      const { error } = await supabaseClient.from('opportunities').update({ pipeline_stage: targetStage }).eq('id', id)
      if (error) {
        toast.error('Erro ao mover card: ' + error.message)
        // revert
        setCols((prev) => ({ ...prev, [originStage!]: [moving, ...prev[originStage!]].filter(Boolean), [targetStage]: prev[targetStage].filter((i: any) => String(i.id) !== String(id)) }))
      } else {
        toast.success('Estágio atualizado')
      }
    } catch (err: any) {
      toast.error('Erro inesperado ao atualizar estágio')
    }

    setDraggingId(null)
  }

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {STAGES.map((s) => (
          <div key={s.key} className="bg-white/5 p-3 rounded-xl min-h-[260px] flex flex-col" onDragOver={onDragOver} onDrop={(e) => onDrop(e, s.key)}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">{s.label}</div>
              <div className="text-xs text-slate-400">{cols[s.key]?.length ?? 0}</div>
            </div>

            <div className="flex-1 overflow-auto space-y-3">
              {cols[s.key]?.map((o: any) => (
                <div key={o.id} draggable onDragStart={(e) => onDragStart(e, String(o.id))}>
                  <OpportunityCard opp={o} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
