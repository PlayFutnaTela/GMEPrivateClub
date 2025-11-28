import React from 'react'
import { requireAdminOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import KpiCard from '../../../../components/ui/KpiCard'
import { TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react'

export default async function ReportsPage() {
  await requireAdminOrRedirect()

  const { data: opportunities, error } = await supabaseServer.from('opportunities').select('id, value, status')

  if (error) {
    return <div className="p-8 text-red-500">Erro ao buscar oportunidades: {error.message}</div>
  }

  const ops = opportunities ?? []

  // Definições: considerar como vendido quando status === 'vendido' OR pipeline_stage === 'finalizado' — priorizar status
  const soldOps = ops.filter((o: any) => String(o.status).toLowerCase() === 'vendido' || String(o.pipeline_stage ?? '').toLowerCase() === 'finalizado')

  const totalVendido = soldOps.reduce((s: number, o: any) => s + (Number(o.value) || 0), 0)
  const itensVendidos = soldOps.length
  const comissao = totalVendido * 0.05

  return (
    <div className="p-8 min-h-screen space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="text-sm text-slate-500 mt-1">Visão financeira das vendas</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Total Vendido" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalVendido)} hint="Total das vendas realizadas" icon={<TrendingUp />} />

        <KpiCard title="Comissão Estimada (5%)" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(comissao)} hint="Estimativa de comissão" icon={<DollarSign />} />

        <KpiCard title="Itens Vendidos" value={itensVendidos} hint="Unidades vendidas" icon={<CheckCircle2 />} />
      </div>

    </div>
  )
}
