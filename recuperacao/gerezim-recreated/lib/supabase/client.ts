import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Singleton client used across the app when needed
export const supabaseClient: SupabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true }
})

// Backwards compatible helper used by components expecting createClient() helper
export function createClient(initialSession?: any): SupabaseClient {
  // Accept initialSession for backwards compat with components that pass a session.
  // For now we return the singleton client — if a session-aware client is required
  // we may build it from createSupabaseClient(supabaseUrl, supabaseAnonKey, { auth: { ... } })
  return supabaseClient
}

export default createClient
