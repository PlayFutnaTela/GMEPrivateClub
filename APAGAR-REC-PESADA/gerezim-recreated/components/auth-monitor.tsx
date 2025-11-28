"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthMonitor() {
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    load()
  }, [])

  return (
    <div className="text-xs text-slate-400">Sessão: {session ? 'Ativa' : 'Inativa'}</div>
  )
}
