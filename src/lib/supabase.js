import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabase() {
  if (_supabase) return _supabase

  // NEXT_PUBLIC_ vars are available both client and server side
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.log('[supabase] Missing env vars:', { url: !!url, key: !!key })
    return null
  }

  // Skip placeholder values
  if (url.includes('your-project-url') || key.includes('your-anon-key')) {
    return null
  }

  _supabase = createClient(url, key)
  return _supabase
}
