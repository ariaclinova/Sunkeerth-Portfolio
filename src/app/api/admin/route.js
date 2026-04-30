import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
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
        const query = supabase.from(table).select('*')
        // site_config has no sort_order
        if (table !== 'site_config') {
          query.order('sort_order', { ascending: true })
        }
        const { data: rows, error } = await query
        if (error) throw error
        return NextResponse.json({ data: rows })
      }

      case 'get': {
        const { data: row, error } = await supabase.from(table).select('*').eq('id', id).single()
        if (error) throw error
        return NextResponse.json({ data: row })
      }

      case 'create': {
        // Remove any undefined/null id for auto-increment tables
        const insertData = { ...data }
        if (table !== 'projects' && !insertData.id) {
          delete insertData.id
        }
        delete insertData.created_at

        const { data: row, error } = await supabase.from(table).insert(insertData).select()
        if (error) throw error
        return NextResponse.json({ data: row?.[0] || row })
      }

      case 'update': {
        const updateData = { ...data }
        const updateId = id || updateData.id
        delete updateData.created_at

        // For site_config, always use id=1
        const targetId = table === 'site_config' ? 1 : updateId

        // Don't include id in the update payload for auto-increment tables
        if (table !== 'projects') {
          delete updateData.id
        }

        const { data: rows, error } = await supabase
          .from(table)
          .update(updateData)
          .eq('id', targetId)
          .select()

        if (error) throw error
        return NextResponse.json({ data: rows?.[0] || rows })
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
    console.error(`[admin api] ${action} ${table}:`, err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
