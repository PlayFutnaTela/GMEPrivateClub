"use client"
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { toast } from 'sonner'

export default function ChangePasswordModalLocal({ onClose }: { onClose?: () => void }) {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChange() {
    if (password.length < 6) return toast.error('Senha precisa ter pelo menos 6 caracteres')
    if (password !== confirm) return toast.error('As senhas não conferem')
    setLoading(true)
    const { data, error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Senha alterada')
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => onClose?.()}></div>
      <div className="bg-white rounded-xl p-6 z-60 w-full max-w-md">
        <h3 className="font-semibold mb-2">Alterar senha</h3>
        <div className="space-y-2">
          <input placeholder="Nova senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input placeholder="Confirmar senha" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={handleChange} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </div>
    </div>
  )
}
