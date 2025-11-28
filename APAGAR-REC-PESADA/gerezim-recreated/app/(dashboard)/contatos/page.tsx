import React from 'react'
import { requireAdminOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import ContactCard from '../../../../components/contacts/ContactCard'
import Link from 'next/link'

export default async function ContactsPage() {
  // Proteção: somente admin
  await requireAdminOrRedirect()

  // Buscar contatos ordenados por data (desc)
  const { data: contacts, error } = await supabaseServer.from('contacts').select('*').order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-red-500">Erro ao carregar contatos: {error.message}</div>
      </div>
    )
  }

  const items = contacts ?? []

  return (
    <div className="space-y-8 p-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contatos</h1>
          <p className="text-sm text-slate-500 mt-1">Leads capturados e contato de clientes</p>
        </div>

        <div>
          <Link href="/contatos/novo" className="inline-flex items-center px-3 py-2 rounded-md bg-gold-500 text-black font-semibold">Novo Contato</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-white/5 rounded-xl">Nenhum contato encontrado.</div>
        ) : (
          items.map((c: any) => (
            <ContactCard key={c.id} contact={{ id: c.id, full_name: c.full_name ?? c.name ?? '—', phone: c.phone, status: c.status, interests: c.interests ?? [], source: c.source, created_at: c.created_at }} />
          ))
        )}
      </div>
    </div>
  )
}
