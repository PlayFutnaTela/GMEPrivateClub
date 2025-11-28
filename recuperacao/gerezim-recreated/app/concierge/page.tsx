import React from 'react'
import { supabaseServer } from '../../../lib/supabase/server'
import Sidebar from '../../../components/layout/sidebar'
import ConciergeLayoutClient from '../../../components/concierge/ConciergeLayoutClient'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ConciergePage() {
  // Auth & Admin check - using cookie 'user_id' as a simple example for server-side check.
  // In production use a proper session check or @supabase/auth-helpers.
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value
  const forceAdmin = process.env.FORCE_ADMIN === '1'

  let isAdmin = false
  if (forceAdmin) isAdmin = true
  if (userId) {
    const { data: profile } = await supabaseServer.from('profiles').select('id,full_name,role').eq('id', userId).single()
    if (profile && profile.role === 'adm') isAdmin = true
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center py-14">
          <h2 className="text-2xl font-semibold">Acesso restrito</h2>
          <p className="text-sm text-slate-500 mt-2">Esta área é destinada à equipe de Concierge. Você não tem permissão para acessar.</p>
          <div className="mt-6">
            <Link href="/dashboard" className="text-sm text-slate-700 underline">Voltar ao Painel</Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch initial data
  const [{ data: folders }, { data: conversations }, { data: settings }, { data: profiles }] = await Promise.all([
    supabaseServer.from('concierge_folders').select('*').order('name', { ascending: true }),
    supabaseServer.from('concierge_conversations').select('id, title, last_message, updated_at, folder_id, customer_id').order('updated_at', { ascending: false }),
    supabaseServer.from('concierge_settings').select('*').limit(1).single(),
    supabaseServer.from('profiles').select('id, full_name, avatar_url')
  ])

  const initialData = { folders: folders ?? [], conversations: conversations ?? [], settings: settings ?? null, profiles: profiles ?? [] }

  return (
    <div className="flex min-h-screen bg-navy-900 text-white">
      <aside className="hidden lg:block w-72 p-6">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 bg-[linear-gradient(180deg,#0b2132,rgba(10,20,30,0.9))]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Concierge — Atendimento</h1>
            <div className="text-sm text-slate-300 mt-1">Converse com clientes e gerencie conversas em tempo real</div>
          </div>

          <div className="bg-[rgba(255,255,255,0.04)] rounded-xl p-4">
            {/* Client-managed layout */}
            {/* @ts-expect-error Server->Client prop */}
            <ConciergeLayoutClient initialData={initialData} />
          </div>
        </div>
      </main>
    </div>
  )
}
