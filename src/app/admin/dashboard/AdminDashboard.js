'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TABS = [
  { key: 'projects', label: 'Projects' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'articles', label: 'Articles' },
  { key: 'side_projects', label: 'Side Projects' },
  { key: 'site_config', label: 'Site Config' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('projects')
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null) // null = list view, object = editing
  const [message, setMessage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list', table: tab }),
    })
    if (res.ok) {
      const data = await res.json()
      setItems(data.data || [])
    } else if (res.status === 401) {
      router.push('/admin')
    }
  }, [tab, router])

  useEffect(() => {
    setEditing(null)
    setMessage(null)
    fetchItems()
  }, [tab, fetchItems])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
    router.refresh()
  }

  const handleSave = async (formData) => {
    const isNew = !formData.id || formData._isNew
    const cleanData = { ...formData }
    delete cleanData._isNew

    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: isNew ? 'create' : 'update',
        table: tab,
        data: cleanData,
        id: cleanData.id,
      }),
    })

    if (res.ok) {
      setMessage({ type: 'success', text: isNew ? 'Created successfully' : 'Updated successfully' })
      setEditing(null)
      fetchItems()
    } else {
      const err = await res.json()
      setMessage({ type: 'error', text: err.error || 'Failed to save' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', table: tab, id }),
    })
    if (res.ok) {
      setMessage({ type: 'success', text: 'Deleted successfully' })
      fetchItems()
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    setUploading(false)
    if (res.ok) {
      const data = await res.json()
      return data.url
    } else {
      setMessage({ type: 'error', text: 'Upload failed' })
      return null
    }
  }

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div>
          <h1>Portfolio Admin</h1>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>← View site</Link>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Sign Out</button>
      </div>

      <nav className="admin-nav">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </nav>

      {message && (
        <div className={`admin-message admin-message--${message.type}`}>{message.text}</div>
      )}

      {editing ? (
        <ItemEditor
          item={editing}
          table={tab}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          onUpload={handleUpload}
          uploading={uploading}
        />
      ) : tab === 'site_config' ? (
        <SiteConfigEditor items={items} onSave={handleSave} />
      ) : (
        <ItemList
          items={items}
          table={tab}
          onEdit={(item) => setEditing(item)}
          onNew={() => setEditing({ _isNew: true })}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

function ItemList({ items, table, onEdit, onNew, onDelete }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>{items.length} items</p>
        <button className="btn btn-primary btn-sm" onClick={onNew}>+ Add New</button>
      </div>
      {items.length === 0 ? (
        <p style={{ textAlign: 'center', padding: 60, color: 'var(--text-tertiary)', fontSize: 14 }}>
          No items yet. Connect Supabase and add your first item.
        </p>
      ) : (
        items.map((item) => (
          <div className="admin-card" key={item.id}>
            <h3>{item.name || item.title || item.id}</h3>
            <p>{item.description || item.excerpt || item.tagline || ''}</p>
            <div className="admin-card-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </>
  )
}

function ItemEditor({ item, table, onSave, onCancel, onUpload, uploading }) {
  const [form, setForm] = useState({ ...item })
  const isNew = item._isNew

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (e, field) => {
    const url = await onUpload(e)
    if (url) handleChange(field, url)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  // Render fields based on table type
  const fields = getFieldsForTable(table)

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
          {isNew ? 'New Item' : `Edit: ${form.name || form.title || form.id}`}
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">Save</button>
        </div>
      </div>

      {fields.map((field) => (
        <div className={field.half ? 'form-row' : ''} key={field.key}>
          {field.type === 'image' ? (
            <div className="form-group">
              <label>{field.label}</label>
              {form[field.key] && (
                <img src={form[field.key]} alt="" style={{ width: 200, borderRadius: 8, marginBottom: 8 }} />
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field.key)} disabled={uploading} />
              {uploading && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Uploading...</p>}
              <input
                type="text"
                placeholder="Or paste image URL"
                value={form[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                style={{ marginTop: 8 }}
              />
            </div>
          ) : field.type === 'textarea' ? (
            <div className="form-group">
              <label>{field.label}</label>
              <textarea value={form[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} />
            </div>
          ) : field.type === 'json' ? (
            <div className="form-group">
              <label>{field.label} (JSON)</label>
              <textarea
                value={typeof form[field.key] === 'string' ? form[field.key] : JSON.stringify(form[field.key] || [], null, 2)}
                onChange={(e) => {
                  try {
                    handleChange(field.key, JSON.parse(e.target.value))
                  } catch {
                    handleChange(field.key, e.target.value)
                  }
                }}
                style={{ fontFamily: 'monospace', fontSize: 13 }}
              />
            </div>
          ) : (
            <div className="form-group">
              <label>{field.label}</label>
              <input
                type={field.type || 'text'}
                value={form[field.key] || ''}
                onChange={(e) => handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            </div>
          )}
        </div>
      ))}
    </form>
  )
}

function SiteConfigEditor({ items, onSave }) {
  const config = items[0] || {}
  const [form, setForm] = useState(config)

  useEffect(() => { setForm(items[0] || {}) }, [items])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  const fields = [
    { key: 'hero_headline', label: 'Hero Headline (bold part)' },
    { key: 'hero_headline_secondary', label: 'Hero Headline (gray part)' },
    { key: 'hero_subline', label: 'Hero Subline' },
    { key: 'contact_headline', label: 'Contact Headline' },
    { key: 'footer_copy', label: 'Footer Copy' },
    { key: 'logo_companies', label: 'Logo Companies (comma-separated)' },
    { key: 'social_linkedin', label: 'LinkedIn URL' },
    { key: 'social_dribbble', label: 'Dribbble URL' },
    { key: 'social_medium', label: 'Medium URL' },
    { key: 'social_twitter', label: 'Twitter/X URL' },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Site Configuration</h2>
        <button type="submit" className="btn btn-primary btn-sm">Save Config</button>
      </div>
      {fields.map((f) => (
        <div className="form-group" key={f.key}>
          <label>{f.label}</label>
          <input type="text" value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
        </div>
      ))}
    </form>
  )
}

function getFieldsForTable(table) {
  switch (table) {
    case 'projects':
      return [
        { key: 'id', label: 'ID (slug)', type: 'text' },
        { key: 'name', label: 'Name' },
        { key: 'tagline', label: 'Tagline' },
        { key: 'description', label: 'Description' },
        { key: 'category', label: 'Category' },
        { key: 'color', label: 'Color' },
        { key: 'gradient', label: 'Gradient CSS' },
        { key: 'image_url', label: 'Cover Image', type: 'image' },
        { key: 'badge_icon', label: 'Badge Icon' },
        { key: 'badge_text', label: 'Badge Text' },
        { key: 'year', label: 'Year' },
        { key: 'role', label: 'Role' },
        { key: 'timeline', label: 'Timeline' },
        { key: 'team', label: 'Team' },
        { key: 'overview', label: 'Overview', type: 'textarea' },
        { key: 'challenge', label: 'Challenge', type: 'textarea' },
        { key: 'stats', label: 'Stats', type: 'json' },
        { key: 'process_steps', label: 'Process Steps', type: 'json' },
        { key: 'impact', label: 'Impact', type: 'json' },
        { key: 'next_project', label: 'Next Project ID' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]
    case 'highlights':
      return [
        { key: 'emoji', label: 'Emoji' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]
    case 'articles':
      return [
        { key: 'title', label: 'Title' },
        { key: 'excerpt', label: 'Excerpt' },
        { key: 'date', label: 'Date' },
        { key: 'read_time', label: 'Read Time' },
        { key: 'url', label: 'URL' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]
    case 'side_projects':
      return [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'stats', label: 'Stats' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]
    default:
      return []
  }
}
