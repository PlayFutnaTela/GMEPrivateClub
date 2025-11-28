"use client"
import React from 'react'
import { Button } from '../ui/button'

export default function InsumosList({ insumos, onEdit, onDelete }: { insumos: any[]; onEdit: (i: any) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insumos.map((i) => (
          <div key={i.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{i.name}</div>
                <div className="text-xs text-slate-500 mt-1">SKU: {i.sku ?? '—'}</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold">{i.quantity ?? 0}</div>
                <div className="text-xs text-slate-400">quantidade</div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-600">{i.description ?? ''}</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-500">R$ {Number(i.unit_price ?? 0).toFixed(2)}</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => onEdit(i)}>Editar</Button>
                <Button variant="ghost" onClick={async () => {
                  if (!confirm('Remover insumo?')) return
                  // delete via client
                  const { data, error } = await (await import('../../lib/supabase/client')).supabaseClient.from('insumos').delete().eq('id', i.id)
                  if (error) alert('Erro ao remover: ' + error.message)
                  else onDelete(i.id)
                }}>Excluir</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
