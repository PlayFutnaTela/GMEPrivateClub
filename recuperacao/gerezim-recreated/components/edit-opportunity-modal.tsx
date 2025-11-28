"use client"
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { toast } from 'sonner'

export default function EditOpportunityModal({ occ, onUpdated, onClose }: { occ: any; onUpdated?: (o:any)=>void; onClose?: ()=>void }) {
  const supabase = createClient()
  const [title, setTitle] = useState(occ?.title ?? '')
  const [value, setValue] = useState(occ?.value ?? 0)
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setLoading(true)
    const { data, error } = await supabase.from('opportunities').update({ title, value }).eq('id', occ.id).select().single()
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Oportunidade atualizada')
    onUpdated?.(data)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => onClose?.()}></div>
      <div className="bg-white rounded-lg p-6 z-60 w-full max-w-md">
        <h3 className="font-semibold mb-2">Editar oportunidade</h3>
        <div className="space-y-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={handleUpdate} disabled={loading}>{loading ? 'Atualizando...' : 'Salvar'}</Button>
        </div>
      </div>
    </div>
  )
}
