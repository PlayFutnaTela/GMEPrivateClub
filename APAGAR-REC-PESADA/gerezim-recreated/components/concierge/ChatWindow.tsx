"use client"
import React, { useState, useRef, useEffect } from 'react'
import { PaperPlane, Paperclip, Smile } from 'lucide-react'

export default function ChatWindow({ conversation, profiles }: { conversation: any; profiles: any[] }) {
  // For this scaffold we'll use simple local state to emulate messages
  const [messages, setMessages] = useState<any[]>(() => (conversation && conversation.last_message ? [{ id: 'm1', role: 'user', text: conversation.last_message, created_at: conversation.updated_at }] : []))
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setMessages(conversation && conversation.last_message ? [{ id: 'm1', role: 'user', text: conversation.last_message, created_at: conversation.updated_at }] : [])
  }, [conversation?.id, conversation?.last_message])

  function sendMessage() {
    if (!text.trim()) return
    setMessages((s) => [...s, { id: Math.random().toString(36).slice(2), role: 'agent', text, created_at: new Date().toISOString() }])
    setText('')
    setIsTyping(false)
    // Placeholder: here you would call an API to send/save the message and call webhook if configured
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 space-y-4">
        {messages.length === 0 ? <div className="text-center text-slate-400">Sem mensagens nessa conversa</div> : messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'agent' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[65%] p-3 rounded-xl ${m.role === 'agent' ? 'bg-gold-500 text-black' : 'bg-white/5'}`}>
              <div className="text-sm leading-relaxed">{m.text}</div>
              <div className="text-xs text-slate-300 mt-2 text-right">{new Date(m.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 p-3 bg-[rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <button onClick={() => fileRef.current?.click()} className="p-2 rounded-md hover:bg-white/5"><Paperclip size={16} /></button>
          <input ref={fileRef} type="file" className="hidden" />

          <div className="flex-1 relative">
            <textarea value={text} onChange={(e) => { setText(e.target.value); setIsTyping(!!e.target.value) }} rows={1} className="w-full resize-none rounded-md px-3 py-2 bg-white/5 placeholder:text-slate-400" placeholder="Escreva uma mensagem..." />
            {isTyping && <div className="absolute -bottom-5 left-2 text-xs text-slate-400">Digitando...</div>}
          </div>

          <button onClick={() => setText((t) => t + ' 🙂')} className="p-2 rounded-md hover:bg-white/5"><Smile size={16} /></button>
          <button onClick={sendMessage} className="p-2 rounded-md bg-gold-500 text-black hover:brightness-95"><PaperPlane size={16} /></button>
        </div>
      </div>
    </div>
  )
}
