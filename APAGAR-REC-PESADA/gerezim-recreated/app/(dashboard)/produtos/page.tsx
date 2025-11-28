import React from 'react'
import { requireAdminOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import ProductForm from '../../../../components/products/ProductForm'
import ProductList from '../../../../components/products/ProductList'

export default async function ProductsPage() {
  await requireAdminOrRedirect()

  const [productsRes, sessionRes] = await Promise.all([
    supabaseServer.from('products').select('id, title, price, category, images, stock, description, currency, status, created_at').order('created_at', { ascending: false }).limit(500),
    // small session placeholder — server side we can fetch profile to get info for uploads
    supabaseServer.auth.getUser()
  ])

  const products = productsRes.data ?? []
  const session = sessionRes.data ?? null

  return (
    <div className="p-8 min-h-screen space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie produtos: cadastro, edição, imagens e status.</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          {/* @ts-expect-error Server -> Client */}
          <ProductForm initialSession={session} />
        </div>

        <div className="md:col-span-2">
          {/* @ts-expect-error Server -> Client */}
          <ProductList products={products} />
        </div>
      </div>
    </div>
  )
}
