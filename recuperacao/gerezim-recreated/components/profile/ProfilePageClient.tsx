"use client"
import React, { useEffect, useState } from 'react'
import { supabaseClient } from '../../lib/supabase/client'
import AvatarUpload from './AvatarUpload'
import ChangePasswordModal from './ChangePasswordModal'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { toast, Toaster } from 'sonner'

export default function ProfilePageClient({ initialProfile, userId }: { initialProfile?: any; userId: string }) {
  const [profile, setProfile] = useState<any | null>(initialProfile ?? null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? '')
  const [phone, setPhone] = useState(initialProfile?.phone ?? '')
  const [city, setCity] = useState(initialProfile?.city ?? '')
  const [stateVal, setStateVal] = useState(initialProfile?.state ?? '')
  const [bio, setBio] = useState(initialProfile?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? '')

  useEffect(() => {
    // Fetch latest profile on mount (client-side effect)
    let mounted = true
    async function fetchProfile() {
      setLoading(true)
      const { data, error } = await supabaseClient.from('profiles').select('id, full_name, email, avatar_url, phone, city, state, bio, created_at').eq('id', userId).single()
      setLoading(false)
      if (error) {
        console.error('Erro ao buscar profile', error)
        return
      }
      if (mounted && data) {
        setProfile(data)
        setFullName(data.full_name ?? '')
        setPhone(data.phone ?? '')
        setCity(data.city ?? '')
        setStateVal(data.state ?? '')
        setBio(data.bio ?? '')
        setAvatarUrl(data.avatar_url ?? '')
      }
    }

    fetchProfile()
    return () => { mounted = false }
  }, [userId])

  async function handleSave() {
    setSaving(true)
    try {
      const payload: any = {
        id: userId,
        full_name: fullName,
        phone,
        city,
        state: stateVal,
        bio,
        avatar_url: avatarUrl
      }
      const { data, error } = await supabaseClient.from('profiles').upsert(payload).select().single()
      setSaving(false)
      if (error) return toast.error('Erro ao salvar: ' + error.message)
      toast.success('Perfil salvo com sucesso')
      setProfile(data)
    } catch (err) {
      setSaving(false)
      toast.error('Erro inesperado')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Toaster position="top-right" />

      {/* Left column: avatar & summary */}
      <div className="col-span-1">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <Avatar src={avatarUrl || undefined} name={fullName || 'Usuário'} size={96} />
            <div className="text-lg font-semibold">{fullName || '—'}</div>
            <div className="text-xs text-slate-500">{profile?.email ?? '—'}</div>
            <div className="text-sm text-slate-400 mt-2">Membro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '—'}</div>

            <div className="w-full mt-4">
              <AvatarUpload userId={userId} initialUrl={avatarUrl} onUploaded={(url) => setAvatarUrl(url)} />
            </div>
          </div>
        </div>
      </div>

      {/* Right column: edit form & security */}
      <div className="col-span-2 space-y-6">
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Dados pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500">Nome completo</label>
              <input className="w-full border rounded-md px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-slate-500">Telefone</label>
              <input className="w-full border rounded-md px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-slate-500">Cidade</label>
              <input className="w-full border rounded-md px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-slate-500">Estado</label>
              <input className="w-full border rounded-md px-3 py-2" value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-500">Bio</label>
              <textarea rows={4} className="w-full border rounded-md px-3 py-2" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => { setFullName(initialProfile?.full_name ?? ''); setPhone(initialProfile?.phone ?? ''); setCity(initialProfile?.city ?? ''); setStateVal(initialProfile?.state ?? ''); setBio(initialProfile?.bio ?? ''); setAvatarUrl(initialProfile?.avatar_url ?? '') }}>Reverter</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</Button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Segurança</h3>
          <div className="text-sm text-slate-600">Gerencie suas credenciais de acesso.</div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">Alterar senha</div>
            <div>
              <Button variant="ghost" onClick={() => setOpenChangePassword(true)}>Alterar senha</Button>
            </div>
          </div>
        </div>

      </div>

      {openChangePassword && <ChangePasswordModal onClose={() => setOpenChangePassword(false)} />}
    </div>
  )
}
