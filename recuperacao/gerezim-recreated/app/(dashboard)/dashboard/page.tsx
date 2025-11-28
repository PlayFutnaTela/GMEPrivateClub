import React from 'react'
import { requireAdminOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import KpiCard from '../../../../components/ui/KpiCard'
import PeriodSelector from '../../../../components/dashboard/PeriodSelector'
import DashboardCharts from '../../../../components/dashboard/DashboardCharts'
import { Briefcase, Users, Activity, DollarSign } from 'lucide-react'

type Props = { searchParams?: { range?: string } }

function rangeToDays(range?: string) {
  switch (range) {
    case '7d': return 7
    case '90d': return 90
    case '365d': return 365
    default: return 30
  }
}

function dateToKey(d: Date) {
  return d.toISOString().slice(0,10)
}

export default async function DashboardPage({ searchParams }: Props) {
  await requireAdminOrRedirect()

  const range = searchParams?.range ?? '30d'
  const days = rangeToDays(range)
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // Fetch raw data
  const [opsRes, contactsRes, productsRes] = await Promise.all([
    supabaseServer.from('opportunities').select('id, value, status, category, created_at').gte('created_at', start.toISOString()),
    supabaseServer.from('contacts').select('id, full_name, phone, status, interests, source, created_at').gte('created_at', start.toISOString()),
    supabaseServer.from('products').select('id, title, price, sales_count, category').order('price', { ascending: false }).limit(50),
  ])

  const opportunities = opsRes.data ?? []
  const contacts = contactsRes.data ?? []
  const products = productsRes.data ?? []

  // KPIs
  const totalOpportunities = opportunities.length
  const volumeTotal = opportunities.reduce((s: any, o: any) => s + (Number(o.value) || 0), 0)
  const volumeNegotiation = opportunities.filter((o:any) => (o.status || '').toLowerCase() === 'negotiation' || (o.status || '').toLowerCase() === 'em negociação').reduce((s:any,o:any)=> s + (Number(o.value)||0),0)
  const activeContacts = contacts.length

  // By category grouping
  const byCategoryMap: Record<string, { name: string; count: number; value: number }> = {}
  for (const o of opportunities) {
    const cat = o.category ?? 'Sem categoria'
    if (!byCategoryMap[cat]) byCategoryMap[cat] = { name: cat, count: 0, value: 0 }
    byCategoryMap[cat].count += 1
    byCategoryMap[cat].value += Number(o.value) || 0
  }
  const byCategory = Object.values(byCategoryMap).sort((a,b)=> b.count - a.count)

  // Timeline: bucket by day
  const timelineMap: Record<string, number> = {}
  for (let i = 0; i <= days; i++) {
    const d = new Date(start.getTime() + i * 24*60*60*1000)
    timelineMap[dateToKey(d)] = 0
  }
  for (const o of opportunities) {
    const key = dateToKey(new Date(o.created_at))
    if (timelineMap[key] !== undefined) timelineMap[key] += Number(o.value)||1
  }
  const timeline = Object.entries(timelineMap).map(([date, value]) => ({ date, value }))

  // Pipeline grouping by status -> count
  const pipelineMap: Record<string, number> = {}
  for (const o of opportunities) {
    const s = (o.status || 'novo').toString()
    pipelineMap[s] = (pipelineMap[s] || 0) + 1
  }
  const pipeline = Object.entries(pipelineMap).map(([stage, count]) => ({ stage, count })).sort((a,b)=> b.count - a.count)

  // Distribution: top products values
  const distribution = products.slice(0,5).map((p:any) => ({ name: p.title ?? '—', value: Number(p.price) || 0 }))

  // Prepare data for charts
  const chartsData = {
    byCategory,
    timeline,
    pipeline,
    distribution
  }

  return (
    <div className="space-y-8 p-8 min-h-screen">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Visão geral — métricas, pipeline e performance</p>
        </div>

        <div className="flex items-center gap-4">
          <PeriodSelector />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total de Oportunidades" value={totalOpportunities} hint="Número de oportunidades no período" icon={<Briefcase />} />
        <KpiCard title="Contatos Ativos" value={activeContacts} hint="Leads capturados" icon={<Users />} />
        <KpiCard title="Volume em Negociação" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(volumeNegotiation)} hint="Valor em negociação" icon={<Activity />} />
        <KpiCard title="Volume Total" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(volumeTotal)} hint="Valor total" icon={<DollarSign />} />
      </div>

      <div>
        <DashboardCharts data={chartsData as any} />
      </div>
    </div>
  )
}
