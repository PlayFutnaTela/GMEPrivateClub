"use client"
import React, { useMemo, useState } from 'react'
import { ProductCard } from '../products/ProductCard'
import ProductModal from './ProductModal'

type Product = {
  id: string
  title: string
  price?: number
  category?: string
  images?: string[]
  stock?: number
  description?: string
  currency?: string
}

export default function OpportunitiesStore({ initialProducts, userProfile }: { initialProducts: Product[]; userProfile?: any }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | 'all'>('all')
  const [selected, setSelected] = useState<Product | null>(null)

  const categories = useMemo(() => {
    const set = new Set<string>()
    (initialProducts ?? []).forEach((p) => { if (p.category) set.add(p.category) })
    return Array.from(set)
  }, [initialProducts])

  const filtered = useMemo(() => {
    return (initialProducts ?? []).filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (query && !(`${p.title} ${p.description ?? ''}`.toLowerCase().includes(query.toLowerCase()))) return false
      return true
    })
  }, [initialProducts, query, category])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome, descrição..." className="px-3 py-2 rounded-md border bg-white/5" />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-md border bg-white/5 text-sm">
            <option value="all">Todas as categorias</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="text-sm text-slate-500">{filtered.length} resultado(s)</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="relative" onClick={() => setSelected(p)}>
            <ProductCard product={{ id: p.id, title: p.title, subtitle: p.description ?? '', price: p.price, images: p.images, currency: p.currency, tags: [p.category ?? ''] }} />
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)}></div>
          <div className="bg-white rounded-xl p-6 z-60 w-full max-w-4xl">
            <ProductModal product={selected} userProfile={userProfile} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
