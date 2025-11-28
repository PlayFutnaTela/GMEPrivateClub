"use client"
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'

export default function FavoritesListLocal({ userId, initial }: { userId?: string; initial?: any[] }) {
  const supabase = createClient()
  const [items, setItems] = useState(initial ?? [])

  async function remove(id: string) {
    const { error } = await supabase.from('favorites').delete().eq('id', id)
    if (error) { alert('Erro: ' + error.message); return }
    setItems((s) => s.filter((i)=>i.id !== id))
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="bg-white border rounded-xl p-3 shadow-sm">
            <div className="h-36 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
              {it.product?.images?.[0] ? <img src={it.product.images[0]} className="w-full h-full object-cover" /> : 'Sem imagem'}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{it.product?.title}</div>
                <div className="text-xs text-slate-500">{it.product?.category}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => remove(it.id)}>Remover</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
