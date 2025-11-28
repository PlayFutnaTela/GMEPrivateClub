"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { toast } from 'sonner'

export default function AddOpportunityModal({ onCreated, onClose }: { onCreated?: () => void; onClose?: () => void }) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('0')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    const { data, error } = await supabase.from('opportunities').insert([{ title, value: Number(price) }]).select().single()
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Oportunidade criada')
    onCreated?.()
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => onClose?.()}></div>
      <div className="bg-white rounded-lg p-6 z-60 w-full max-w-md">
        <h3 className="text-lg font-semibold">Nova oportunidade</h3>

        <div className="mt-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full border rounded px-3 py-2" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Valor" type="number" className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={handleCreate} disabled={loading}>{loading ? 'Criando...' : 'Criar'}</Button>
        </div>
      </div>
    </div>
  )
}
