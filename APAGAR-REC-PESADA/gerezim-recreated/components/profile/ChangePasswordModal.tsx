"use client"
import React, { useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import { Button } from '../ui/button'
import { toast } from 'sonner'

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChange() {
    if (newPassword.length < 6) return toast.error('Senha deve ter pelo menos 6 caracteres')
    if (newPassword !== confirmPassword) return toast.error('As senhas não conferem')

    setLoading(true)
    const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword })
    setLoading(false)
    if (error) return toast.error('Erro ao alterar senha: ' + error.message)
    toast.success('Senha alterada com sucesso')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white rounded-xl p-6 z-60 w-full max-w-md">
        <h3 className="text-lg font-semibold">Alterar senha</h3>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs text-slate-500">Nova senha</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-slate-500">Confirmar senha</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" />
          </div>

          <div className="flex items-center justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleChange} disabled={loading}>{loading ? 'Alterando...' : 'Alterar senha'}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
