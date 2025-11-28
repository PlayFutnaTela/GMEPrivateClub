import React from 'react'
import { requireAdminOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import PipelineBoard from '../../../../components/pipeline/PipelineBoard'

export default async function PipelinePage() {
  await requireAdminOrRedirect()

  const { data: opportunities, error } = await supabaseServer.from('opportunities').select('*')

  if (error) {
    return <div className="p-8 text-red-500">Erro ao buscar oportunidades: {error.message}</div>
  }

  const initial = opportunities ?? []

  return (
    <div className="p-8 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="text-sm text-slate-500 mt-1">Visualização Kanban — arraste cards entre estágios para atualizar.</p>
      </header>

      {/* @ts-expect-error server -> client */}
      <PipelineBoard initialOpportunities={initial} />
    </div>
  )
}
