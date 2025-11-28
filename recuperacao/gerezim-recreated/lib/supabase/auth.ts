import { supabaseClient } from './client'

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signUp({ email, password })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut()
  return { error }
}
