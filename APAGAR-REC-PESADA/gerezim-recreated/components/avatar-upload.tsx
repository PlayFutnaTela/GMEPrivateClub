"use client"
import React, { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'

export default function AvatarUploadLocal({ userId, initial }: { userId: string; initial?: string }) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState(initial ?? '')

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setLoading(true)
    const path = `avatars/${userId}-${Date.now()}-${f.name}`
    const { error } = await supabase.storage.from('avatars').upload(path, f, { upsert: true })
    if (error) { alert('Upload error: ' + error.message); setLoading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setUrl(data.publicUrl)
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
        {url ? <img src={url} className="w-full h-full object-cover" /> : <div className="text-slate-400">Sem avatar</div>}
      </div>
      <div className="flex items-center gap-2">
        <input type="file" ref={fileRef} onChange={onFile} accept="image/*" className="hidden" />
        <Button onClick={() => fileRef.current?.click()} disabled={loading}>{loading ? 'Enviando...' : 'Escolher'}</Button>
      </div>
    </div>
  )
}
