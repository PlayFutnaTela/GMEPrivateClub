import React from 'react'

export default function Home() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-[2.25rem] font-bold font-title">Bem-vindo ao GEREZIM</h1>
        <p className="text-slate-600 mt-2">Esqueleto inicial seguindo a orientação de recuperação — Next.js + TypeScript + Tailwind + Supabase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold">Dashboard Shell</h3>
          <p className="text-sm text-slate-500 mt-2">Sidebar, Topbar e layout principal — pronto para ser expandido.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold">Autenticação Supabase</h3>
          <p className="text-sm text-slate-500 mt-2">Client e middleware preparados (exemplos na pasta lib/supabase).</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold">Design System</h3>
          <p className="text-sm text-slate-500 mt-2">Tailwind, cores navy/gold e famílias tipográficas (Playfair Display + Inter).</p>
        </div>
      </div>
    </section>
  )
}
