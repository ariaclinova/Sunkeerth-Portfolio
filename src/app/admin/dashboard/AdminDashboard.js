'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SECTIONS = [
  { key: 'overview', label: 'Overview', icon: '🏠' },
  { key: 'projects', label: 'Projects', icon: '💼' },
  { key: 'highlights', label: 'Highlights', icon: '🏆' },
  { key: 'articles', label: 'Articles', icon: '📝' },
  { key: 'side_projects', label: 'Side Projects', icon: '🔧' },
  { key: 'site_config', label: 'Site Settings', icon: '⚙️' },
]

export default function AdminDashboard() {
  const [section, setSection] = useState('overview')
  const [allData, setAllData] = useState({ projects: [], highlights: [], articles: [], side_projects: [], site_config: [] })
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const tables = ['projects', 'highlights', 'articles', 'side_projects', 'site_config']
    const results = {}
    for (const t of tables) {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', table: t }),
      })
      if (res.status === 401) { router.push('/admin'); return }
      if (res.ok) {
        const d = await res.json()
        results[t] = d.data || []
      }
    }
    setAllData(results)
    setLoading(false)
  }, [router])

  useEffect(() => { fetchAll() }, [fetchAll])

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 4000)
      return () => clearTimeout(t)
    }
  }, [message])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
    router.refresh()
  }

  const apiCall = async (action, table, data, id) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, table, data, id }),
    })
    return res
  }

  const handleSave = async (table, formData) => {
    const isNew = formData._isNew
    const cleanData = { ...formData }
    delete cleanData._isNew
    delete cleanData.created_at

    const res = await apiCall(isNew ? 'create' : 'update', table, cleanData, cleanData.id)
    if (res.ok) {
      setMessage({ type: 'success', text: isNew ? 'Created successfully' : 'Saved successfully' })
      setEditing(null)
      fetchAll()
    } else {
      const err = await res.json()
      setMessage({ type: 'error', text: err.error || 'Failed to save' })
    }
  }

  const handleDelete = async (table, id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return
    const res = await apiCall('delete', table, null, id)
    if (res.ok) {
      setMessage({ type: 'success', text: 'Deleted' })
      fetchAll()
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return null
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    setUploading(false)
    if (res.ok) { const d = await res.json(); return d.url }
    const err = await res.json().catch(() => ({}))
    setMessage({ type: 'error', text: err.error || 'Upload failed' })
    return null
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .adm { display: flex; min-height: 100vh; }

        /* Sidebar */
        .adm-side { width: 240px; background: #fafafa; border-right: 1px solid var(--border); padding: 24px 0; flex-shrink: 0; position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; }
        .adm-side__logo { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--text-primary); padding: 0 20px; margin-bottom: 4px; }
        .adm-side__sub { font-size: 12px; color: var(--text-tertiary); padding: 0 20px; margin-bottom: 32px; }
        .adm-side__links { flex: 1; }
        .adm-side__link { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 20px; font-family: var(--font-body); font-size: 14px; font-weight: 400; color: var(--text-secondary); background: none; border: none; cursor: pointer; text-align: left; transition: background 0.1s, color 0.1s; }
        .adm-side__link:hover { background: #f0f0f0; color: var(--text-primary); }
        .adm-side__link--active { background: #fff; color: var(--text-primary); font-weight: 600; border-right: 2px solid var(--text-primary); }
        .adm-side__link span:first-child { font-size: 16px; width: 22px; text-align: center; }
        .adm-side__footer { padding: 16px 20px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
        .adm-side__footer a, .adm-side__footer button { font-size: 13px; color: var(--text-tertiary); text-decoration: none; background: none; border: none; cursor: pointer; text-align: left; padding: 0; font-family: var(--font-body); transition: color 0.15s; }
        .adm-side__footer a:hover, .adm-side__footer button:hover { color: var(--text-primary); }

        /* Main */
        .adm-main { flex: 1; padding: 32px 40px; max-width: 900px; }
        .adm-main__title { font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .adm-main__desc { font-size: 14px; color: var(--text-tertiary); margin-bottom: 32px; }

        /* Toast */
        .adm-toast { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; z-index: 9999; animation: toastIn 0.3s ease; }
        .adm-toast--success { background: #dcfce7; color: #166534; }
        .adm-toast--error { background: #fee2e2; color: #dc2626; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        /* Overview cards */
        .adm-overview { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 40px; }
        .adm-stat { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; }
        .adm-stat:hover { border-color: var(--text-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .adm-stat__num { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--text-primary); }
        .adm-stat__label { font-size: 13px; color: var(--text-tertiary); margin-top: 4px; }

        /* Item list */
        .adm-items { display: flex; flex-direction: column; gap: 12px; }
        .adm-item { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: border-color 0.15s; }
        .adm-item:hover { border-color: #ccc; }
        .adm-item__info { flex: 1; min-width: 0; }
        .adm-item__name { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .adm-item__meta { font-size: 13px; color: var(--text-tertiary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .adm-item__tag { display: inline-block; font-size: 11px; font-weight: 500; background: var(--bg-secondary); color: var(--text-secondary); padding: 2px 8px; border-radius: 100px; margin-left: 8px; }
        .adm-item__actions { display: flex; gap: 6px; flex-shrink: 0; }
        .adm-item__btn { font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border); background: #fff; cursor: pointer; transition: background 0.1s, border-color 0.1s; color: var(--text-secondary); font-family: var(--font-body); }
        .adm-item__btn:hover { background: var(--bg-secondary); border-color: #ccc; color: var(--text-primary); }
        .adm-item__btn--del { color: #dc2626; border-color: #fecaca; }
        .adm-item__btn--del:hover { background: #fee2e2; border-color: #dc2626; }
        .adm-item__preview { width: 56px; height: 56px; border-radius: 8px; flex-shrink: 0; }

        /* Top bar for list */
        .adm-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .adm-topbar__count { font-size: 13px; color: var(--text-tertiary); }
        .adm-add-btn { font-family: var(--font-display); font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 10px; border: none; background: var(--text-primary); color: #fff; cursor: pointer; transition: opacity 0.15s; }
        .adm-add-btn:hover { opacity: 0.85; }

        /* Form */
        .adm-form { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
        .adm-form__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
        .adm-form__title { font-family: var(--font-display); font-size: 20px; font-weight: 700; }
        .adm-form__actions { display: flex; gap: 8px; }
        .adm-form__section { margin-bottom: 28px; }
        .adm-form__section-label { font-family: var(--font-display); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-light); }
        .adm-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .adm-form__row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .adm-form__row, .adm-form__row3 { grid-template-columns: 1fr; } }
        .adm-field { margin-bottom: 16px; }
        .adm-field label { display: block; font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 5px; }
        .adm-field__help { font-size: 11px; color: var(--text-tertiary); margin-top: 3px; }
        .adm-field input, .adm-field textarea, .adm-field select { width: 100%; font-family: var(--font-body); font-size: 14px; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 8px; background: #fff; color: var(--text-primary); outline: none; transition: border-color 0.15s; }
        .adm-field input:focus, .adm-field textarea:focus { border-color: var(--text-primary); }
        .adm-field textarea { min-height: 80px; resize: vertical; line-height: 1.5; }
        .adm-field textarea.mono { font-family: monospace; font-size: 12px; min-height: 120px; }
        .adm-field__img-preview { width: 120px; height: 80px; border-radius: 8px; object-fit: cover; margin-bottom: 8px; }

        /* Inline stat/step editors */
        .adm-repeater { display: flex; flex-direction: column; gap: 8px; }
        .adm-repeater__row { display: flex; gap: 8px; align-items: center; }
        .adm-repeater__row input { flex: 1; }
        .adm-repeater__remove { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #fecaca; background: #fff; color: #dc2626; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.1s; }
        .adm-repeater__remove:hover { background: #fee2e2; }
        .adm-repeater__add { font-size: 13px; color: var(--text-secondary); background: none; border: 1px dashed var(--border); border-radius: 8px; padding: 8px; cursor: pointer; transition: border-color 0.15s, color 0.15s; margin-top: 4px; }
        .adm-repeater__add:hover { border-color: var(--text-primary); color: var(--text-primary); }

        /* Responsive sidebar */
        @media (max-width: 768px) {
          .adm { flex-direction: column; }
          .adm-side { width: 100%; height: auto; position: relative; flex-direction: row; padding: 12px 0; overflow-x: auto; border-right: none; border-bottom: 1px solid var(--border); }
          .adm-side__logo, .adm-side__sub, .adm-side__footer { display: none; }
          .adm-side__links { display: flex; gap: 0; }
          .adm-side__link { white-space: nowrap; padding: 8px 16px; border-right: none; }
          .adm-side__link--active { border-right: none; border-bottom: 2px solid var(--text-primary); }
          .adm-main { padding: 24px 16px; }
        }
      `}</style>

      {message && (
        <div className={`adm-toast adm-toast--${message.type}`}>{message.text}</div>
      )}

      <div className="adm">
        {/* Sidebar */}
        <aside className="adm-side">
          <p className="adm-side__logo">Portfolio Admin</p>
          <p className="adm-side__sub">Manage your content</p>
          <div className="adm-side__links">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                className={`adm-side__link ${section === s.key ? 'adm-side__link--active' : ''}`}
                onClick={() => { setSection(s.key); setEditing(null) }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="adm-side__footer">
            <Link href="/">View live site</Link>
            <button onClick={handleLogout}>Sign out</button>
          </div>
        </aside>

        {/* Main content */}
        <main className="adm-main">
          {section === 'overview' && (
            <OverviewSection data={allData} onNavigate={(s) => { setSection(s); setEditing(null) }} />
          )}
          {section === 'projects' && !editing && (
            <ProjectsList
              projects={allData.projects}
              onEdit={(p) => setEditing(p)}
              onNew={() => setEditing({ _isNew: true })}
              onDelete={(id) => handleDelete('projects', id)}
            />
          )}
          {section === 'projects' && editing && (
            <ProjectForm
              project={editing}
              allProjects={allData.projects}
              onSave={(data) => handleSave('projects', data)}
              onCancel={() => setEditing(null)}
              onUpload={handleUpload}
              uploading={uploading}
            />
          )}
          {section === 'highlights' && !editing && (
            <SimpleList
              title="Highlights"
              desc="Awards, features, and recognition"
              items={allData.highlights}
              onEdit={(item) => setEditing(item)}
              onNew={() => setEditing({ _isNew: true })}
              onDelete={(id) => handleDelete('highlights', id)}
              renderItem={(h) => <><span style={{ fontSize: 20, marginRight: 8 }}>{h.emoji}</span>{h.title}</>}
              renderMeta={(h) => h.description}
            />
          )}
          {section === 'highlights' && editing && (
            <HighlightForm
              item={editing}
              onSave={(data) => handleSave('highlights', data)}
              onCancel={() => setEditing(null)}
            />
          )}
          {section === 'articles' && !editing && (
            <SimpleList
              title="Articles"
              desc="Blog posts and writing"
              items={allData.articles}
              onEdit={(item) => setEditing(item)}
              onNew={() => setEditing({ _isNew: true })}
              onDelete={(id) => handleDelete('articles', id)}
              renderItem={(a) => a.title}
              renderMeta={(a) => `${a.date || ''} ${a.read_time ? '· ' + a.read_time : ''}`}
            />
          )}
          {section === 'articles' && editing && (
            <ArticleForm
              item={editing}
              onSave={(data) => handleSave('articles', data)}
              onCancel={() => setEditing(null)}
            />
          )}
          {section === 'side_projects' && !editing && (
            <SimpleList
              title="Side Projects"
              desc="Personal projects and community work"
              items={allData.side_projects}
              onEdit={(item) => setEditing(item)}
              onNew={() => setEditing({ _isNew: true })}
              onDelete={(id) => handleDelete('side_projects', id)}
              renderItem={(s) => s.title}
              renderMeta={(s) => s.description}
            />
          )}
          {section === 'side_projects' && editing && (
            <SideProjectForm
              item={editing}
              onSave={(data) => handleSave('side_projects', data)}
              onCancel={() => setEditing(null)}
            />
          )}
          {section === 'site_config' && (
            <SiteConfigForm
              config={allData.site_config?.[0] || {}}
              onSave={(data) => handleSave('site_config', data)}
            />
          )}
        </main>
      </div>
    </>
  )
}

/* ========================================
   OVERVIEW
   ======================================== */
function OverviewSection({ data, onNavigate }) {
  const stats = [
    { label: 'Projects', count: data.projects?.length || 0, key: 'projects' },
    { label: 'Highlights', count: data.highlights?.length || 0, key: 'highlights' },
    { label: 'Articles', count: data.articles?.length || 0, key: 'articles' },
    { label: 'Side Projects', count: data.side_projects?.length || 0, key: 'side_projects' },
  ]
  return (
    <>
      <h1 className="adm-main__title">Dashboard</h1>
      <p className="adm-main__desc">Overview of your portfolio content</p>
      <div className="adm-overview">
        {stats.map((s) => (
          <div key={s.key} className="adm-stat" onClick={() => onNavigate(s.key)}>
            <div className="adm-stat__num">{s.count}</div>
            <div className="adm-stat__label">{s.label}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recent Projects</h3>
      {(data.projects || []).slice(0, 3).map((p) => (
        <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 8, background: p.gradient, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{p.category} · {p.year}</div>
          </div>
        </div>
      ))}
    </>
  )
}

/* ========================================
   PROJECTS LIST
   ======================================== */
function ProjectsList({ projects, onEdit, onNew, onDelete }) {
  return (
    <>
      <h1 className="adm-main__title">Projects</h1>
      <p className="adm-main__desc">Case studies shown on your portfolio. Click to edit.</p>
      <div className="adm-topbar">
        <span className="adm-topbar__count">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
        <button className="adm-add-btn" onClick={onNew}>+ New Project</button>
      </div>
      <div className="adm-items">
        {projects.map((p) => (
          <div className="adm-item" key={p.id}>
            <div className="adm-item__preview" style={{ background: p.image_url ? `url(${p.image_url}) center/cover` : p.gradient }} />
            <div className="adm-item__info">
              <div className="adm-item__name">
                {p.name}
                <span className="adm-item__tag">{p.category}</span>
              </div>
              <div className="adm-item__meta">{p.description} · {p.year}</div>
            </div>
            <div className="adm-item__actions">
              <button className="adm-item__btn" onClick={() => onEdit(p)}>Edit</button>
              <button className="adm-item__btn adm-item__btn--del" onClick={() => onDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ========================================
   PROJECT FORM (the big one)
   ======================================== */
/* ========================================
   IMAGE GALLERY EDITOR (reusable)
   ======================================== */
function ImageGalleryEditor({ images, onChange, onUpload, uploading, label, help }) {
  const items = Array.isArray(images) ? images : []

  const addImage = () => {
    onChange([...items, { url: '', caption: '', layout: 'full' }])
  }

  const updateImage = (i, key, val) => {
    const arr = [...items]
    arr[i] = { ...arr[i], [key]: val }
    onChange(arr)
  }

  const removeImage = (i) => {
    onChange(items.filter((_, j) => j !== i))
  }

  const handleUpload = async (e, i) => {
    const url = await onUpload(e)
    if (url) updateImage(i, 'url', url)
  }

  return (
    <div style={{ marginTop: 16, padding: 16, background: '#f9f9f9', borderRadius: 10, border: '1px dashed #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label || 'Section Images'}</p>
          {help && <p className="adm-field__help">{help}</p>}
        </div>
        <button type="button" className="adm-repeater__add" style={{ margin: 0, padding: '6px 14px' }} onClick={addImage}>+ Add Image</button>
      </div>

      {items.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px 0' }}>
          No images yet. Click "+ Add Image" to add product screenshots, mockups, or diagrams.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((img, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid var(--border)' }}>
            {/* Preview */}
            {img.url && (
              <img
                src={img.url}
                alt={img.caption || ''}
                style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }}
              />
            )}
            {!img.url && (
              <div style={{ width: '100%', height: 80, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 13, color: 'var(--text-tertiary)' }}>
                No image — upload or paste URL below
              </div>
            )}

            {/* Upload + URL */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, i)}
                disabled={uploading}
                style={{ flex: 1, fontSize: 12 }}
              />
              {uploading && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Uploading...</span>}
            </div>
            <input
              value={img.url || ''}
              onChange={(e) => updateImage(i, 'url', e.target.value)}
              placeholder="Or paste image URL"
              style={{ width: '100%', fontSize: 13, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 8 }}
            />

            {/* Caption + Layout + Remove */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={img.caption || ''}
                onChange={(e) => updateImage(i, 'caption', e.target.value)}
                placeholder="Caption (optional)"
                style={{ flex: 1, fontSize: 13, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6 }}
              />
              <select
                value={img.layout || 'full'}
                onChange={(e) => updateImage(i, 'layout', e.target.value)}
                style={{ fontSize: 13, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff' }}
              >
                <option value="full">Full width</option>
                <option value="half">Half (side by side)</option>
                <option value="third">Third (3 across)</option>
              </select>
              <button type="button" className="adm-repeater__remove" onClick={() => removeImage(i)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectForm({ project, allProjects, onSave, onCancel, onUpload, uploading }) {
  const isNew = project._isNew
  const [f, setF] = useState({
    id: '', name: '', tagline: '', description: '', category: 'Product Design',
    color: '#1a1a2e', gradient: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    image_url: '', badge_icon: '', badge_text: '',
    year: new Date().getFullYear().toString(), role: '', timeline: '', team: '',
    overview: '', challenge: '',
    stats: [{ value: '', label: '' }],
    process_steps: [{ step: '', detail: '' }],
    impact: [{ metric: '', label: '' }],
    hero_images: [], overview_images: [], challenge_images: [],
    process_images: [], solution_images: [], impact_images: [],
    next_project: '', sort_order: 0,
    ...project,
  })

  const stats = Array.isArray(f.stats) ? f.stats : []
  const steps = Array.isArray(f.process_steps) ? f.process_steps : []
  const impact = Array.isArray(f.impact) ? f.impact : []

  const set = (key, val) => setF((prev) => ({ ...prev, [key]: val }))

  const handleCoverUpload = async (e) => {
    const url = await onUpload(e)
    if (url) set('image_url', url)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...f }
    if (isNew) data._isNew = true
    if (!data.id && data.name) {
      data.id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    onSave(data)
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-form__header">
        <h2 className="adm-form__title">{isNew ? 'New Project' : `Edit: ${f.name}`}</h2>
        <div className="adm-form__actions">
          <button type="button" className="adm-item__btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="adm-add-btn">Save Project</button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Basic Information</p>
        <div className="adm-form__row">
          <div className="adm-field">
            <label>Project Name *</label>
            <input value={f.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. Meridian" />
          </div>
          <div className="adm-field">
            <label>URL Slug</label>
            <input value={f.id} onChange={(e) => set('id', e.target.value)} placeholder="auto-generated from name" />
            <p className="adm-field__help">Used in the URL: /project/slug</p>
          </div>
        </div>
        <div className="adm-field">
          <label>Tagline</label>
          <input value={f.tagline || ''} onChange={(e) => set('tagline', e.target.value)} placeholder="Short tagline for the project" />
        </div>
        <div className="adm-field">
          <label>Description</label>
          <input value={f.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="One-line description shown on the card" />
        </div>
        <div className="adm-form__row3">
          <div className="adm-field">
            <label>Category</label>
            <select value={f.category || ''} onChange={(e) => set('category', e.target.value)}>
              <option>Product Design</option>
              <option>Mobile Design</option>
              <option>Systems Design</option>
              <option>UX Design</option>
              <option>Information Architecture</option>
              <option>Web Design</option>
            </select>
          </div>
          <div className="adm-field">
            <label>Year</label>
            <input value={f.year || ''} onChange={(e) => set('year', e.target.value)} placeholder="2025" />
          </div>
          <div className="adm-field">
            <label>Sort Order</label>
            <input type="number" value={f.sort_order || 0} onChange={(e) => set('sort_order', Number(e.target.value))} />
            <p className="adm-field__help">Lower = shown first</p>
          </div>
        </div>
      </div>

      {/* Cover Image & Appearance */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Cover Image & Appearance</p>
        <div className="adm-field">
          <label>Cover Image (shown on project card)</label>
          {f.image_url && <img src={f.image_url} alt="" className="adm-field__img-preview" />}
          <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
          {uploading && <p className="adm-field__help">Uploading...</p>}
          <input value={f.image_url || ''} onChange={(e) => set('image_url', e.target.value)} placeholder="Or paste image URL" style={{ marginTop: 8 }} />
          <p className="adm-field__help">If no image, the gradient is used as the cover</p>
        </div>
        <div className="adm-form__row">
          <div className="adm-field">
            <label>Gradient CSS</label>
            <input value={f.gradient || ''} onChange={(e) => set('gradient', e.target.value)} placeholder="linear-gradient(145deg, #1a1a2e 0%, ...)" />
          </div>
          <div className="adm-field">
            <label>Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={f.color || '#1a1a2e'} onChange={(e) => set('color', e.target.value)} style={{ width: 40, height: 36, padding: 2, cursor: 'pointer' }} />
              <input value={f.color || ''} onChange={(e) => set('color', e.target.value)} style={{ flex: 1 }} />
            </div>
          </div>
        </div>
        <div className="adm-form__row">
          <div className="adm-field">
            <label>Badge Icon</label>
            <input value={f.badge_icon || ''} onChange={(e) => set('badge_icon', e.target.value)} placeholder="e.g. ★" />
          </div>
          <div className="adm-field">
            <label>Badge Text</label>
            <input value={f.badge_text || ''} onChange={(e) => set('badge_text', e.target.value)} placeholder="e.g. 4.8 App Store" />
          </div>
        </div>
      </div>

      {/* Hero Images */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Hero Images</p>
        <p className="adm-field__help" style={{ marginBottom: 4 }}>Large images shown at the top of the case study, right after the hero banner</p>
        <ImageGalleryEditor
          images={f.hero_images}
          onChange={(imgs) => set('hero_images', imgs)}
          onUpload={onUpload}
          uploading={uploading}
          label="Hero showcase images"
          help="Add key product screenshots or hero shots. These appear prominently at the top."
        />
      </div>

      {/* Role & Team */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Role & Team</p>
        <div className="adm-form__row3">
          <div className="adm-field">
            <label>Your Role</label>
            <input value={f.role || ''} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Lead Product Designer" />
          </div>
          <div className="adm-field">
            <label>Timeline</label>
            <input value={f.timeline || ''} onChange={(e) => set('timeline', e.target.value)} placeholder="e.g. 6 months" />
          </div>
          <div className="adm-field">
            <label>Team</label>
            <input value={f.team || ''} onChange={(e) => set('team', e.target.value)} placeholder="e.g. 2 designers, 4 engineers" />
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Overview</p>
        <div className="adm-field">
          <label>Overview Text</label>
          <textarea value={f.overview || ''} onChange={(e) => set('overview', e.target.value)} placeholder="What was this project about? 2-3 sentences." />
        </div>
        <ImageGalleryEditor
          images={f.overview_images}
          onChange={(imgs) => set('overview_images', imgs)}
          onUpload={onUpload}
          uploading={uploading}
          label="Overview images"
          help="Product shots, context images, or before/after comparisons"
        />
      </div>

      {/* Challenge */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Challenge</p>
        <div className="adm-field">
          <label>Challenge Text</label>
          <textarea value={f.challenge || ''} onChange={(e) => set('challenge', e.target.value)} placeholder="What problem were you solving? What made it hard?" />
        </div>
        <ImageGalleryEditor
          images={f.challenge_images}
          onChange={(imgs) => set('challenge_images', imgs)}
          onUpload={onUpload}
          uploading={uploading}
          label="Challenge images"
          help="Screenshots of the old design, user pain points, data visualizations"
        />
      </div>

      {/* Stats (shown on card) */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Card Stats</p>
        <p className="adm-field__help" style={{ marginBottom: 12 }}>Shown as badges on the project card (e.g. "60% faster insights")</p>
        <div className="adm-repeater">
          {stats.map((s, i) => (
            <div className="adm-repeater__row" key={i}>
              <input value={s.value || ''} placeholder="Value (e.g. 60%)" onChange={(e) => {
                const arr = [...stats]; arr[i] = { ...arr[i], value: e.target.value }; set('stats', arr)
              }} />
              <input value={s.label || ''} placeholder="Label (e.g. faster insights)" onChange={(e) => {
                const arr = [...stats]; arr[i] = { ...arr[i], label: e.target.value }; set('stats', arr)
              }} />
              <button type="button" className="adm-repeater__remove" onClick={() => { const arr = stats.filter((_, j) => j !== i); set('stats', arr) }}>×</button>
            </div>
          ))}
          <button type="button" className="adm-repeater__add" onClick={() => set('stats', [...stats, { value: '', label: '' }])}>+ Add stat</button>
        </div>
      </div>

      {/* Process Steps */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Process</p>
        <p className="adm-field__help" style={{ marginBottom: 12 }}>Steps shown in the case study page</p>
        <div className="adm-repeater">
          {steps.map((s, i) => (
            <div key={i} style={{ marginBottom: 12, padding: 12, background: '#fafafa', borderRadius: 8 }}>
              <div className="adm-repeater__row" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', width: 24 }}>{String(i+1).padStart(2,'0')}</span>
                <input value={s.step || ''} placeholder="Step name (e.g. Research)" onChange={(e) => {
                  const arr = [...steps]; arr[i] = { ...arr[i], step: e.target.value }; set('process_steps', arr)
                }} />
                <button type="button" className="adm-repeater__remove" onClick={() => set('process_steps', steps.filter((_, j) => j !== i))}>×</button>
              </div>
              <textarea value={s.detail || ''} placeholder="What did you do in this step?" style={{ width: '100%', fontSize: 13, minHeight: 48 }} onChange={(e) => {
                const arr = [...steps]; arr[i] = { ...arr[i], detail: e.target.value }; set('process_steps', arr)
              }} />
            </div>
          ))}
          <button type="button" className="adm-repeater__add" onClick={() => set('process_steps', [...steps, { step: '', detail: '' }])}>+ Add step</button>
        </div>
        <ImageGalleryEditor
          images={f.process_images}
          onChange={(imgs) => set('process_images', imgs)}
          onUpload={onUpload}
          uploading={uploading}
          label="Process images"
          help="Wireframes, sketches, user flows, whiteboard photos"
        />
      </div>

      {/* Solution / Key Screens */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Solution Showcase</p>
        <p className="adm-field__help" style={{ marginBottom: 4 }}>The final designs — key screens, interactions, and product shots</p>
        <ImageGalleryEditor
          images={f.solution_images}
          onChange={(imgs) => set('solution_images', imgs)}
          onUpload={onUpload}
          uploading={uploading}
          label="Solution images"
          help="Final UI screens, mockups, prototypes. Use 'Half' or 'Third' layout to show multiple screens side by side."
        />
      </div>

      {/* Impact Metrics */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Impact</p>
        <p className="adm-field__help" style={{ marginBottom: 12 }}>Key results shown at the bottom of the case study</p>
        <div className="adm-repeater">
          {impact.map((s, i) => (
            <div className="adm-repeater__row" key={i}>
              <input value={s.metric || ''} placeholder="Metric (e.g. 60%)" onChange={(e) => {
                const arr = [...impact]; arr[i] = { ...arr[i], metric: e.target.value }; set('impact', arr)
              }} />
              <input value={s.label || ''} placeholder="Label (e.g. Reduction in time)" onChange={(e) => {
                const arr = [...impact]; arr[i] = { ...arr[i], label: e.target.value }; set('impact', arr)
              }} />
              <button type="button" className="adm-repeater__remove" onClick={() => set('impact', impact.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          <button type="button" className="adm-repeater__add" onClick={() => set('impact', [...impact, { metric: '', label: '' }])}>+ Add metric</button>
        </div>
        <ImageGalleryEditor
          images={f.impact_images}
          onChange={(imgs) => set('impact_images', imgs)}
          onUpload={onUpload}
          uploading={uploading}
          label="Impact images"
          help="Charts, dashboards, before/after metrics screenshots"
        />
      </div>

      {/* Navigation */}
      <div className="adm-form__section">
        <p className="adm-form__section-label">Navigation</p>
        <div className="adm-field">
          <label>Next Project</label>
          <select value={f.next_project || ''} onChange={(e) => set('next_project', e.target.value)}>
            <option value="">None</option>
            {allProjects.filter((p) => p.id !== f.id).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="adm-field__help">The project linked at the bottom of the case study page</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button type="button" className="adm-item__btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="adm-add-btn">Save Project</button>
      </div>
    </form>
  )
}

/* ========================================
   SIMPLE LIST (highlights, articles, side projects)
   ======================================== */
function SimpleList({ title, desc, items, onEdit, onNew, onDelete, renderItem, renderMeta }) {
  return (
    <>
      <h1 className="adm-main__title">{title}</h1>
      <p className="adm-main__desc">{desc}</p>
      <div className="adm-topbar">
        <span className="adm-topbar__count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        <button className="adm-add-btn" onClick={onNew}>+ Add New</button>
      </div>
      <div className="adm-items">
        {items.map((item) => (
          <div className="adm-item" key={item.id}>
            <div className="adm-item__info">
              <div className="adm-item__name">{renderItem(item)}</div>
              <div className="adm-item__meta">{renderMeta(item)}</div>
            </div>
            <div className="adm-item__actions">
              <button className="adm-item__btn" onClick={() => onEdit(item)}>Edit</button>
              <button className="adm-item__btn adm-item__btn--del" onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ========================================
   HIGHLIGHT FORM
   ======================================== */
function HighlightForm({ item, onSave, onCancel }) {
  const isNew = item._isNew
  const [f, setF] = useState({ emoji: '', title: '', description: '', sort_order: 0, ...item })
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); onSave(isNew ? { ...f, _isNew: true } : f) }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-form__header">
        <h2 className="adm-form__title">{isNew ? 'New Highlight' : `Edit: ${f.title}`}</h2>
        <div className="adm-form__actions">
          <button type="button" className="adm-item__btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="adm-add-btn">Save</button>
        </div>
      </div>
      <div className="adm-form__row">
        <div className="adm-field">
          <label>Emoji</label>
          <input value={f.emoji || ''} onChange={(e) => set('emoji', e.target.value)} placeholder="🏆" />
        </div>
        <div className="adm-field">
          <label>Sort Order</label>
          <input type="number" value={f.sort_order || 0} onChange={(e) => set('sort_order', Number(e.target.value))} />
        </div>
      </div>
      <div className="adm-field"><label>Title *</label><input value={f.title || ''} onChange={(e) => set('title', e.target.value)} required /></div>
      <div className="adm-field"><label>Description</label><input value={f.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
    </form>
  )
}

/* ========================================
   ARTICLE FORM
   ======================================== */
function ArticleForm({ item, onSave, onCancel }) {
  const isNew = item._isNew
  const [f, setF] = useState({ title: '', excerpt: '', date: '', read_time: '', url: '', sort_order: 0, ...item })
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); onSave(isNew ? { ...f, _isNew: true } : f) }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-form__header">
        <h2 className="adm-form__title">{isNew ? 'New Article' : `Edit: ${f.title}`}</h2>
        <div className="adm-form__actions">
          <button type="button" className="adm-item__btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="adm-add-btn">Save</button>
        </div>
      </div>
      <div className="adm-field"><label>Title *</label><input value={f.title || ''} onChange={(e) => set('title', e.target.value)} required /></div>
      <div className="adm-field"><label>Excerpt</label><input value={f.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)} placeholder="One-line summary" /></div>
      <div className="adm-form__row3">
        <div className="adm-field"><label>Date</label><input value={f.date || ''} onChange={(e) => set('date', e.target.value)} placeholder="e.g. Feb 2026" /></div>
        <div className="adm-field"><label>Read Time</label><input value={f.read_time || ''} onChange={(e) => set('read_time', e.target.value)} placeholder="e.g. 6 min read" /></div>
        <div className="adm-field"><label>Sort Order</label><input type="number" value={f.sort_order || 0} onChange={(e) => set('sort_order', Number(e.target.value))} /></div>
      </div>
      <div className="adm-field"><label>URL</label><input value={f.url || ''} onChange={(e) => set('url', e.target.value)} placeholder="Link to article" /></div>
    </form>
  )
}

/* ========================================
   SIDE PROJECT FORM
   ======================================== */
function SideProjectForm({ item, onSave, onCancel }) {
  const isNew = item._isNew
  const [f, setF] = useState({ title: '', description: '', stats: '', sort_order: 0, ...item })
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); onSave(isNew ? { ...f, _isNew: true } : f) }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-form__header">
        <h2 className="adm-form__title">{isNew ? 'New Side Project' : `Edit: ${f.title}`}</h2>
        <div className="adm-form__actions">
          <button type="button" className="adm-item__btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="adm-add-btn">Save</button>
        </div>
      </div>
      <div className="adm-field"><label>Title *</label><input value={f.title || ''} onChange={(e) => set('title', e.target.value)} required /></div>
      <div className="adm-field"><label>Description</label><textarea value={f.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
      <div className="adm-form__row">
        <div className="adm-field"><label>Stats</label><input value={f.stats || ''} onChange={(e) => set('stats', e.target.value)} placeholder="e.g. +200 members · 12 sessions" /></div>
        <div className="adm-field"><label>Sort Order</label><input type="number" value={f.sort_order || 0} onChange={(e) => set('sort_order', Number(e.target.value))} /></div>
      </div>
    </form>
  )
}

/* ========================================
   SITE CONFIG FORM
   ======================================== */
function SiteConfigForm({ config, onSave }) {
  const [f, setF] = useState(config)
  useEffect(() => { setF(config) }, [config])
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); onSave(f) }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-form__header">
        <h2 className="adm-form__title">Site Settings</h2>
        <button type="submit" className="adm-add-btn">Save Settings</button>
      </div>

      <div className="adm-form__section">
        <p className="adm-form__section-label">Hero Section</p>
        <div className="adm-field">
          <label>Headline (bold part)</label>
          <input value={f.hero_headline || ''} onChange={(e) => set('hero_headline', e.target.value)} />
          <p className="adm-field__help">The first part shown in bold, e.g. "Sunkeerth Reddy is"</p>
        </div>
        <div className="adm-field">
          <label>Headline (gray part)</label>
          <input value={f.hero_headline_secondary || ''} onChange={(e) => set('hero_headline_secondary', e.target.value)} />
          <p className="adm-field__help">Continues after the bold part in lighter color</p>
        </div>
        <div className="adm-field">
          <label>Subline</label>
          <input value={f.hero_subline || ''} onChange={(e) => set('hero_subline', e.target.value)} />
        </div>
      </div>

      <div className="adm-form__section">
        <p className="adm-form__section-label">Social Links</p>
        <div className="adm-form__row">
          <div className="adm-field"><label>LinkedIn</label><input value={f.social_linkedin || ''} onChange={(e) => set('social_linkedin', e.target.value)} /></div>
          <div className="adm-field"><label>Dribbble</label><input value={f.social_dribbble || ''} onChange={(e) => set('social_dribbble', e.target.value)} /></div>
        </div>
        <div className="adm-form__row">
          <div className="adm-field"><label>Medium</label><input value={f.social_medium || ''} onChange={(e) => set('social_medium', e.target.value)} /></div>
          <div className="adm-field"><label>Twitter / X</label><input value={f.social_twitter || ''} onChange={(e) => set('social_twitter', e.target.value)} /></div>
        </div>
      </div>

      <div className="adm-form__section">
        <p className="adm-form__section-label">Other</p>
        <div className="adm-field"><label>Contact Headline</label><input value={f.contact_headline || ''} onChange={(e) => set('contact_headline', e.target.value)} /></div>
        <div className="adm-field"><label>Footer Copy</label><input value={f.footer_copy || ''} onChange={(e) => set('footer_copy', e.target.value)} /></div>
        <div className="adm-field">
          <label>Logo Companies</label>
          <input value={f.logo_companies || ''} onChange={(e) => set('logo_companies', e.target.value)} />
          <p className="adm-field__help">Comma-separated list shown in the logos strip</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button type="submit" className="adm-add-btn">Save Settings</button>
      </div>
    </form>
  )
}
