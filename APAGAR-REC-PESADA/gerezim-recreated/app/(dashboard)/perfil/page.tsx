import React from 'react'
import { requireUserOrRedirect } from '../../../../lib/auth'
import { supabaseServer } from '../../../../lib/supabase/server'
import ProfilePageClient from '../../../../components/profile/ProfilePageClient'

export default async function ProfilePage() {
  const { userId } = await requireUserOrRedirect()

  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('id, full_name, email, avatar_url, phone, city, state, bio, created_at')
    .eq('id', userId)
    .single()

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-sm text-slate-500 mt-1">Visualize e edite suas informações pessoais e de segurança.</p>
      </header>

      {/* @ts-expect-error Server -> Client */}
      <ProfilePageClient initialProfile={profile} userId={userId} />
    </div>
  )
}
