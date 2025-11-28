import React from 'react'
import { requireAdminOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import InsumosPageClient from '../../../../components/insumos/InsumosPageClient'

export default async function InsumosPage() {
  await requireAdminOrRedirect()

  // fetch all insumos ordered by created_at desc
  const { data: insumos, error } = await supabaseServer.from('insumos').select('*').order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-red-500">Erro ao carregar insumos: {error.message}</div>
      </div>
    )
  }

  const initial = insumos ?? []

  return (
    <div className="p-8 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Insumos</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie insumos (CRUD) — adicione, edite e remova itens.</p>
        </div>

        <div className="text-sm text-slate-400">Actions</div>
      </header>

      {/* @ts-expect-error Server -> Client */}
      <InsumosPageClient initialInsumos={initial} />
    </div>
  )
}
