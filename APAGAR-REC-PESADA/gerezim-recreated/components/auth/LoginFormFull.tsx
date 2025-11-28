"use client"
import React, { useEffect, useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginFormFull({ initialMessage }: { initialMessage?: string | null }) {
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'forgot'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (initialMessage) toast.error(initialMessage)
  }, [initialMessage])

  async function signIn() {
    setLoading(true)
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Login realizado — redirecionando...')
    router.push('/dashboard')
  }

  async function signUp() {
    if (password.length < 6) return toast.error('Senha precisa ter pelo menos 6 caracteres')
    setLoading(true)
    const { data, error } = await supabaseClient.auth.signUp({ email, password })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Conta criada — verifique seu email para confirmar')
    setMode('signIn')
  }

  async function forgotPassword() {
    if (!email) return toast.error('Digite seu email para recuperar a senha')
    setLoading(true)
    // Note: supabase-js v3 has resetPasswordForEmail
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/login` })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Email de recuperação enviado (verifique sua caixa de entrada)')
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'signIn') signIn()
    else if (mode === 'signUp') signUp()
    else forgotPassword()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Toaster position="top-right" />

      <div className="bg-white rounded-2xl p-6 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{mode === 'signIn' ? 'Entrar' : mode === 'signUp' ? 'Criar conta' : 'Recuperar senha'}</h2>
            <div className="text-xs text-slate-400">Área segura</div>
          </div>

          <div>
            <label className="text-xs text-slate-600">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="text-xs text-slate-600">Senha</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-2 text-xs text-slate-400">{showPassword ? 'Ocultar' : 'Mostrar'}</button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {mode === 'signIn' ? (<button type="button" onClick={() => setMode('forgot')} className="underline">Esqueceu a senha?</button>) : null}
            </div>
            <div className="flex items-center gap-2">
              {mode !== 'signIn' && <button type="button" onClick={() => setMode('signIn')} className="text-xs text-slate-500 underline">Voltar</button>}
              <Button type="submit" disabled={loading}>{loading ? 'Aguarde...' : mode === 'signIn' ? 'Entrar' : mode === 'signUp' ? 'Criar conta' : 'Enviar email'}</Button>
            </div>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 mt-4">ou</div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          {mode === 'signIn' ? (
            <div>
              <span>Não tem conta?</span>
              <button onClick={() => setMode('signUp')} className="ml-2 underline">Criar Nova Conta</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
