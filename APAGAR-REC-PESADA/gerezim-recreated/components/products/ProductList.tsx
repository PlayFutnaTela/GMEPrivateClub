"use client"
import React, { useState } from 'react'
import ProductForm from './ProductForm'
import { Button } from '../ui/button'
import { supabaseClient } from '../../lib/supabase/client'
import { toast, Toaster } from 'sonner'

export default function ProductList({ products: initial }: { products: any[] }) {
  const [items, setItems] = useState<any[]>(initial ?? [])
  const [editing, setEditing] = useState<any | null>(null)
  const [open, setOpen] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm('Excluir produto? Esta ação é irreversível.')) return
    const { error } = await supabaseClient.from('products').delete().eq('id', id)
    if (error) { toast.error('Erro ao excluir: ' + error.message); return }
    setItems((s) => s.filter((p) => p.id !== id))
    toast.success('Produto excluído')
  }

  function openEdit(p: any) { setEditing(p); setOpen(true) }

  function onSaved(saved: any) {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === saved.id)
      if (idx >= 0) { prev[idx] = saved; return [...prev] }
      return [saved, ...prev]
    })
    setOpen(false)
    setEditing(null)
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-500">Total: {items.length} produtos</div>
        <div>
          <Button onClick={() => { setEditing(null); setOpen(true) }}>Novo produto</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
            <div className="h-40 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
              {p.images && p.images[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" /> : <div className="text-slate-400">Sem imagem</div>}
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-sm">{p.title}</div>
                <div className="text-xs text-slate-500 mt-1">{p.category}</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold">{p.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: p.currency ?? 'BRL' }).format(p.price) : '—'}</div>
                <div className="text-xs text-slate-400 mt-1">{p.status}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-500 truncate max-w-[60%]">{p.description ?? ''}</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => openEdit(p)}>Editar</Button>
                <Button variant="ghost" onClick={() => handleDelete(p.id)}>Excluir</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setEditing(null) }}></div>
          <div className="bg-white rounded-lg p-6 z-60 w-full max-w-3xl">
            <ProductForm initialProduct={editing} onSaved={onSaved} />
          </div>
        </div>
      )}
    </div>
  )
}
