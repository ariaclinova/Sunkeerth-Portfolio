import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getSupabase } from '@/lib/supabase'

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const path = `portfolio/${filename}`

    const { error } = await supabase.storage
      .from('images')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (error) {
      console.error('[upload] Storage error:', error)
      return NextResponse.json({ error: `Storage error: ${error.message}` }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('[upload] Exception:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
