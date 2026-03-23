import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const sb = getSupabase()
  let dbTest = null

  if (sb) {
    try {
      const { data, error } = await sb.from('projects').select('id, name').limit(1)
      dbTest = error ? `Error: ${error.message}` : `OK - found ${data?.length || 0} rows`
    } catch (e) {
      dbTest = `Exception: ${e.message}`
    }
  }

  return NextResponse.json({
    supabase_url_set: !!url,
    supabase_url_prefix: url ? url.substring(0, 20) + '...' : null,
    supabase_key_set: !!key,
    supabase_key_prefix: key ? key.substring(0, 15) + '...' : null,
    client_created: !!sb,
    db_test: dbTest,
    node_env: process.env.NODE_ENV,
  })
}
