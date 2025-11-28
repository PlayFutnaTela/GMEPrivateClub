"use client"
import React, { useState } from 'react'
import { signInWithEmail } from '../../lib/supabase/auth'
import { Button } from '../ui/button'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await signInWithEmail(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else {
      // Redirect or show success — left simple for scaffold
      window.location.href = '/dashboard'
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="text-sm font-medium block mb-1">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full border rounded-md px-3 py-2" />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Senha</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full border rounded-md px-3 py-2" />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div>
        <Button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
      </div>
    </form>
  )
}
