import React from 'react'
import { ProductCard } from '../../../../components/products/ProductCard'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { supabaseServer } from '../../../../lib/supabase/server'
import Link from 'next/link'

type Props = {
  params: { categoria: string }
}

function slugToTitle(slug: string) {
  // Map known slugs to friendly names, fall back to capitalized words
  const map: Record<string, string> = {
    'carros-de-luxo': 'Carros de Luxo',
    'imoveis-premium': 'Imóveis Premium',
    'colecionaveis': 'Colecionáveis'
  }
  if (map[slug]) return map[slug]
  return slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

export default async function CategoriaPage({ params }: Props) {
  const categoryName = slugToTitle(params.categoria)

  // Buscar produtos ativos da categoria
  const { data: products, error } = await supabaseServer
    .from('products')
    .select('id, title, subtitle, price, currency, images, tags, category, status')
    .eq('category', categoryName)
    .eq('status', 'active')

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="mb-6">
          <Link href="/dashboard/oportunidades" className="text-sm text-slate-500 hover:underline">← Voltar para Oportunidades</Link>
        </div>

        <div className="text-red-600">Erro ao buscar produtos: {error.message}</div>
      </div>
    )
  }

  const items = (products ?? []) as any[]

  return (
    <div className="min-h-screen p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/dashboard/oportunidades" className="text-sm text-slate-500 hover:underline">← Voltar para Oportunidades</Link>
          <h1 className="text-2xl font-semibold mt-3">{categoryName}</h1>
          <div className="text-sm text-slate-500 mt-1">{items.length} resultado(s)</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="max-w-2xl mx-auto mt-14">
          <EmptyState title={`Nenhum item em ${categoryName}`} description="Atualmente não há produtos ativos nessa categoria. Volte mais tarde ou confira outras oportunidades." backHref="/dashboard/oportunidades" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} product={{ id: p.id, title: p.title, subtitle: p.subtitle, price: p.price, currency: p.currency, images: p.images, tags: p.tags }} />
          ))}
        </div>
      )}
    </div>
  )
}
