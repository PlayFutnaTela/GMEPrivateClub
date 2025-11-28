"use client"
import React from 'react'
import { Avatar } from '../ui/avatar'

export default function ConversationList({ conversations, onSelect, selectedId }: { conversations: any[]; onSelect: (id: string) => void; selectedId?: string | null }) {
  return (
    <div className="space-y-2">
      {conversations.map((c) => (
        <div key={c.id} onClick={() => onSelect(c.id)} className={`cursor-pointer rounded-md p-2 hover:bg-[rgba(255,255,255,0.03)] ${selectedId === c.id ? 'bg-[rgba(255,255,255,0.04)]' : ''}`}>
          <div className="flex items-center gap-3">
            <Avatar name={c.title} src={undefined} />
            <div className="flex-1">
              <div className="text-sm font-medium">{c.title}</div>
              <div className="text-xs text-slate-300 mt-1 truncate">{c.last_message ?? 'Sem mensagens ainda'}</div>
            </div>
            <div className="text-xs text-slate-400">{new Date(c.updated_at).toLocaleTimeString()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
