import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabase() {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || url === 'your-project-url' || !key || key === 'your-anon-key') {
    return null
  }
  _supabase = createClient(url, key)
  return _supabase
}

// Legacy named export for compatibility
export const supabase = null // use getSupabase() instead
