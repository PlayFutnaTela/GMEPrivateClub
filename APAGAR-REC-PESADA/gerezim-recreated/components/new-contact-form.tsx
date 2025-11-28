"use client"
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function NewContactForm({ onCreated }: { onCreated?: () => void }) {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    const { error } = await supabase.from('contacts').insert([{ full_name: name, phone }])
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Contato criado')
    onCreated?.()
    setName(''); setPhone('')
  }

  return (
    <div className="bg-white border rounded p-4">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" className="w-full border rounded px-2 py-1 mb-2" />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefone" className="w-full border rounded px-2 py-1 mb-2" />
      <div className="flex items-center justify-end">
        <button onClick={handleCreate} className="px-3 py-1 rounded bg-gold-500 text-black">{loading ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </div>
  )
}
