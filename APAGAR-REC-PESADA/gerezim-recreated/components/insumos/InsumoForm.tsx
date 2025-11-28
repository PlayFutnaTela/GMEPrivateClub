"use client"
import React, { useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import { Button } from '../ui/button'

export default function InsumoForm({ initial, onCancel, onSaved }: { initial?: any; onCancel: () => void; onSaved: (saved: any) => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [sku, setSku] = useState(initial?.sku ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? 0)
  const [unitPrice, setUnitPrice] = useState(initial?.unit_price ?? 0)
  const [description, setDescription] = useState(initial?.description ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      if (initial?.id) {
        const { data, error } = await supabaseClient.from('insumos').update({ name, sku, quantity, unit_price: unitPrice, description }).eq('id', initial.id).select().single()
        setLoading(false)
        if (error) { alert('Erro: '+error.message); return }
        onSaved(data)
      } else {
        const { data, error } = await supabaseClient.from('insumos').insert([{ name, sku, quantity, unit_price: unitPrice, description }]).select().single()
        setLoading(false)
        if (error) { alert('Erro: '+error.message); return }
        onSaved(data)
      }
    } catch (err) {
      setLoading(false)
      alert('Erro inesperado')
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        <label className="text-xs text-slate-500">Nome</label>
        <input className="w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500">SKU</label>
          <input className="w-full border rounded-md px-3 py-2" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>

        <div>
          <label className="text-xs text-slate-500">Quantidade</label>
          <input type="number" className="w-full border rounded-md px-3 py-2" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-500">Preço unitário</label>
        <input type="number" className="w-full border rounded-md px-3 py-2" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
      </div>

      <div>
        <label className="text-xs text-slate-500">Descrição</label>
        <textarea className="w-full border rounded-md px-3 py-2" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </div>
  )
}
