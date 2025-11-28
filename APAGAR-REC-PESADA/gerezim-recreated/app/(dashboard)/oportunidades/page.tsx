import React from 'react'
import { requireUserOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import OpportunitiesStore from '../../../../components/opportunities/OpportunitiesStore'

export default async function OpportunitiesPage() {
  // Require logged user
  const { userId } = await requireUserOrRedirect()

  // Fetch user profile
  const { data: userProfile } = await supabaseServer.from('profiles').select('id, full_name, avatar_url, role').eq('id', userId).single()

  // Fetch active products
  const { data: products } = await supabaseServer
    .from('products')
    .select('id, title, price, category, images, stock, description, currency, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(200)

  const initialProducts = products ?? []

  // Render client-side OpportunitiesStore with initial data
  return (
    <div className="p-8 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Oportunidades</h1>
          <p className="text-sm text-slate-500 mt-1">Descubra oportunidades e manifeste interesse — nossa equipe cuidará do resto.</p>
        </div>
      </header>

      {/* @ts-expect-error server -> client */}
      <OpportunitiesStore initialProducts={initialProducts} userProfile={userProfile} />
    </div>
  )
}
