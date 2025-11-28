"use client"
import React, { useMemo, useState } from 'react'
import ConciergeSidebar from './ConciergeSidebar'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'
import ConciergeMobileMenu from './ConciergeMobileMenu'

type InitialData = {
  folders: any[]
  conversations: any[]
  settings: any | null
  profiles: any[]
}

export default function ConciergeLayoutClient({ initialData }: { initialData: InitialData }) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialData.conversations?.[0]?.id ?? null)
  const [search, setSearch] = useState('')

  const conversations = useMemo(() => {
    if (!search) return initialData.conversations
    const q = search.toLowerCase()
    return initialData.conversations.filter((c: any) => (c.title || '').toLowerCase().includes(q) || (c.last_message || '').toLowerCase().includes(q))
  }, [search, initialData.conversations])

  const activeConversation = initialData.conversations.find((c) => c.id === selectedConversationId) ?? null

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="hidden lg:flex lg:flex-col w-80 gap-4">
        <div className="p-2">
          <input placeholder="Pesquisar conversas" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-md px-3 py-2 text-sm" />
        </div>

        <div className="flex-1 overflow-auto px-2 py-2">
          <ConversationList conversations={conversations} selectedId={selectedConversationId} onSelect={(id: string) => setSelectedConversationId(id)} />
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <ConciergeMobileMenu conversations={initialData.conversations} onSelect={(id: string) => setSelectedConversationId(id)} />
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-[560px] bg-white/5 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{activeConversation ? activeConversation.title : 'Selecione uma conversa'}</div>
              <div className="text-xs text-slate-300 mt-1">{activeConversation ? `Atualizado em ${new Date(activeConversation.updated_at).toLocaleString()}` : 'Nenhuma conversa selecionada'}</div>
            </div>
            <div className="text-xs text-slate-400">Ações</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeConversation ? (
            <ChatWindow conversation={activeConversation} profiles={initialData.profiles} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">Selecione uma conversa para começar</div>
          )}
        </div>
      </div>
    </div>
  )
}
