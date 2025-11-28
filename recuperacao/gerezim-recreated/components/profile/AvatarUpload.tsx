"use client"
import React, { useRef, useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import { Button } from '../ui/button'

export default function AvatarUpload({ userId, initialUrl, onUploaded }: { userId: string; initialUrl?: string | null; onUploaded?: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setLoading(true)
    try {
      const filePath = `avatars/${userId}-${Date.now()}-${f.name}`
      const { error: uploadError } = await supabaseClient.storage.from('avatars').upload(filePath, f, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabaseClient.storage.from('avatars').getPublicUrl(filePath)
      setPreview(data.publicUrl)
      onUploaded?.(data.publicUrl)
    } catch (err: any) {
      alert('Erro ao fazer upload: ' + (err.message ?? String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
        {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : <div className="text-slate-400">Sem avatar</div>}
      </div>

      <div className="flex items-center gap-2">
        <input ref={fileRef} onChange={handleFile} accept="image/*" type="file" className="hidden" />
        <Button onClick={() => fileRef.current?.click()} disabled={loading}>{loading ? 'Enviando...' : 'Alterar foto'}</Button>
        {preview && <Button variant="ghost" onClick={() => { setPreview(null); onUploaded?.('') }}>Remover</Button>}
      </div>
    </div>
  )
}
