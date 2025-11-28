import { supabaseServer } from './supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Verifica se o usuário atual é admin. Se não for, redireciona para /dashboard.
 * Usa cookie 'user_id' como exemplo — em produção substitua por verificação de sessão real.
 */
export async function requireAdminOrRedirect() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value
  const forceAdmin = process.env.FORCE_ADMIN === '1'

  if (forceAdmin) return { isAdmin: true }

  if (!userId) redirect('/dashboard')

  const { data: profile, error } = await supabaseServer.from('profiles').select('id,role').eq('id', userId).single()
  if (error || !profile) redirect('/dashboard')

  if (profile.role !== 'adm') redirect('/dashboard')

  return { isAdmin: true, profile }
}

/**
 * Verifica se o usuário está logado. Retorna o userId ou redireciona para /login.
 */
export async function requireUserOrRedirect() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value
  if (!userId) redirect('/login')
  return { userId }
}
