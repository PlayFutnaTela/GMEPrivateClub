import React from 'react'
import { Badge } from '../ui/Badge'

type Contact = {
  id: string
  full_name: string
  phone?: string
  status?: 'quente' | 'morno' | 'frio'
  interests?: string[]
  source?: string
  created_at?: string
}

function statusLabel(status?: string) {
  if (status === 'quente') return 'Quente'
  if (status === 'morno') return 'Morno'
  return 'Frio'
}

export default function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">{contact.full_name}</div>
          <div className="text-xs text-slate-500 mt-1">{contact.phone ?? '—'}</div>
        </div>

        <div className="text-right">
          <Badge status={contact.status}>{statusLabel(contact.status)}</Badge>
          <div className="text-xs text-slate-400 mt-2">{contact.created_at ? new Date(contact.created_at).toLocaleDateString('pt-BR') : ''}</div>
        </div>
      </header>

      <div className="mt-3 text-sm text-slate-600">
        <div><strong>Interesses:</strong> {contact.interests?.length ? contact.interests.join(', ') : '—'}</div>
        <div className="mt-2 text-xs text-slate-500"><strong>Origem:</strong> {contact.source ?? 'N/A'}</div>
      </div>
    </div>
  )
}
