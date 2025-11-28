import React from 'react'
import Sidebar from '../../components/layout/sidebar'
import Topbar from '../../components/layout/topbar'

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      <Sidebar />

      <div>
        <Topbar />
        <div className="bg-white rounded-lg p-6 mt-4 shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold">Painel</h2>
          <p className="text-sm text-slate-500 mt-2">Seção do dashboard pronta para integrar componentes e integrações com Supabase.</p>
        </div>
      </div>
    </div>
  )
}
