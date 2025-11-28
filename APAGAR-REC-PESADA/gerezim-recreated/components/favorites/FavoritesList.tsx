"use client"
import React, { useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import { ProductCard } from '../products/ProductCard'

type FavoriteItem = {
  id: string // favorite id
  product: any
}

export default function FavoritesList({ initialFavorites, userId }: { initialFavorites: FavoriteItem[]; userId: string }) {
  const [items, setItems] = useState<FavoriteItem[]>(initialFavorites ?? [])
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleRemove(favId: string) {
    setRemoving(favId)
    const { error } = await supabaseClient.from('favorites').delete().eq('id', favId)
    setRemoving(null)
    if (error) {
      // naive error handling — in a real app use toasts
      alert('Erro ao remover favorito: ' + error.message)
      return
    }
    setItems((s) => s.filter((f) => f.id !== favId))
  }

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="p-12 text-center text-slate-400">Você ainda não adicionou favoritos.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((f) => (
            <div key={f.id} className="relative">
              <div className="absolute right-3 top-3 z-20">
                <button onClick={() => handleRemove(f.id)} disabled={removing === f.id} className="px-2 py-1 rounded-md bg-white/10 text-xs">
                  {removing === f.id ? 'Removendo...' : 'Remover'}
                </button>
              </div>

              <ProductCard product={{ id: f.product.id, title: f.product.title, subtitle: f.product.subtitle ?? '', price: f.product.price, images: f.product.images, currency: f.product.currency ?? 'BRL', tags: f.product.tags }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
