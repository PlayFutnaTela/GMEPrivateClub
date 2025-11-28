"use client"
import React from 'react'
import { Menu } from 'lucide-react'

export default function ConciergeMobileMenu({ conversations, onSelect }: { conversations: any[]; onSelect: (id: string) => void }) {
  return (
    <div className="p-2 border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-white/5"><Menu size={18} /></button>
        <div className="text-sm font-semibold">Conversas</div>
      </div>

      <div className="flex items-center gap-2">
        <select onChange={(e) => onSelect(e.target.value)} className="bg-white/5 rounded-md px-2 py-1 text-sm">
          <option value="">Selecione</option>
          {conversations.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
