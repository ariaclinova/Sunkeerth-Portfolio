import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getSupabase } from '@/lib/supabase'

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured. Add your credentials to .env.local' }, { status: 503 })
  }

  const body = await request.json()
  const { action, table, data, id } = body

  const allowed = ['projects', 'highlights', 'articles', 'side_projects', 'site_config']
  if (!allowed.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  try {
    switch (action) {
      case 'list': {
        const { data: rows, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true })
        if (error) throw error
        return NextResponse.json({ data: rows })
      }
      case 'get': {
        const { data: row, error } = await supabase.from(table).select('*').eq('id', id).single()
        if (error) throw error
        return NextResponse.json({ data: row })
      }
      case 'create': {
        const { data: row, error } = await supabase.from(table).insert(data).select().single()
        if (error) throw error
        return NextResponse.json({ data: row })
      }
      case 'update': {
        const { data: row, error } = await supabase.from(table).update(data).eq('id', id).select().single()
        if (error) throw error
        return NextResponse.json({ data: row })
      }
      case 'delete': {
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
