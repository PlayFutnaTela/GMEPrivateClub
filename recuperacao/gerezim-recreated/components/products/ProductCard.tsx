import React from 'react'
import { Button } from '../ui/button'

type Product = {
  id: string
  title: string
  subtitle?: string
  price?: number
  currency?: string
  images?: string[]
  tags?: string[]
}

export function ProductCard({ product }: { product: Product }) {
  const price = product.price ?? 0
  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: product.currency ?? 'BRL' }).format(price)

  return (
    <article className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
      <div className="h-44 bg-slate-100 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          // use simple img for scaffold
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-400">Sem imagem</div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm">{product.title}</h3>
            {product.subtitle && <div className="text-xs text-slate-500 mt-1">{product.subtitle}</div>}
          </div>

          <div className="text-sm font-semibold text-slate-700">{formattedPrice}</div>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">{t}</span>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="ghost">Detalhes</Button>
        </div>
      </div>
    </article>
  )
}
