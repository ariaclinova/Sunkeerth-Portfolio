import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple admin auth — checks against env vars
// In production, use Supabase Auth or NextAuth.js

export async function POST(request) {
  const body = await request.json()
  const { email, password } = body

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sunkeerth.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'

  if (email === adminEmail && password === adminPassword) {
    // Set a simple session cookie (24 hours)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}
