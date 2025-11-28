import React from 'react'
import { requireUserOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import FavoritesList from '../../../../components/favorites/FavoritesList'

export default async function FavoritosPage() {
  // Auth check
  const { userId } = await requireUserOrRedirect()

  // Fetch favorites joined with products for the authenticated user
  const { data: favorites, error } = await supabaseServer
    .from('favorites')
    .select('id, product_id, products ( id, title, subtitle, price, currency, images, tags, category )')
    .eq('user_id', userId)

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-red-500">Erro ao carregar favoritos: {error.message}</div>
      </div>
    )
  }

  // normalize data for client
  const initialFavorites = (favorites ?? []).map((f: any) => ({ id: f.id, product: f.products ?? f.product }))

  return (
    <div className="p-8 min-h-screen space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Favoritos</h1>
          <p className="text-sm text-slate-500 mt-1">Produtos que você marcou como favoritos.</p>
        </div>
      </header>

      {/* Client-side list */}
      {/* @ts-expect-error Server -> Client prop */}
      <FavoritesList initialFavorites={initialFavorites} userId={userId} />
    </div>
  )
}
