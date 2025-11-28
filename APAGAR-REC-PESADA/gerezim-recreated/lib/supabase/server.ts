import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!supabaseUrl || !supabaseServiceKey) {
  // For safety: server code should fail quickly when required env vars are missing
  throw new Error('Missing server Supabase environment variables')
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
