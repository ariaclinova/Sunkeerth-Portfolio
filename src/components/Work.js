'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function Work({ projects, articles, sideProjects }) {
  const [activeId, setActiveId] = useState(projects?.[0]?.id || '')
  const sectionRefs = useRef({})

  useEffect(() => {
    const observers = []
    const allIds = [
      ...(projects || []).map((p) => p.id),
      ...(articles || []).map((_, i) => `article-${i}`),
      ...(sideProjects || []).map((_, i) => `side-${i}`),
    ]
    allIds.forEach((id) => {
      const el = sectionRefs.current[id]
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [projects, articles, sideProjects])

  const scrollTo = (id) => {
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isActive = (id) => activeId === id

  return (
    <>
      <style>{`
        .work-layout { position: relative; background-color: var(--bg-secondary); }
        .work-container { max-width: 1400px; margin: 0 auto; display: flex; min-height: 100vh; }
        .work-sidebar { display: none; }
        @media (min-width: 1024px) { .work-sidebar { display: block; width: 280px; flex-shrink: 0; padding: 0 0 0 48px; } }
        @media (min-width: 1200px) { .work-sidebar { width: 300px; padding: 0 0 0 60px; } }
        .work-sidebar__inner { position: sticky; top: 100px; padding: 40px 0; }
        .sidebar-group { margin-bottom: 32px; }
        .sidebar-group__title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text-primary); padding: 10px 0; margin-bottom: 4px; }
        .sidebar-link { display: flex; align-items: center; padding: 10px 0; cursor: pointer; transition: transform 0.2s; background: none; border: none; width: 100%; text-align: left; }
        .sidebar-link:hover { transform: translateX(5px); }
        .sidebar-link__text { font-family: var(--font-body); font-size: 14px; font-weight: 400; color: #928f8f; transition: color 0.2s, font-weight 0.15s; line-height: 1.4; }
        .sidebar-link--active .sidebar-link__text { color: var(--text-primary); font-weight: 600; }
        .work-content { flex: 1; min-width: 0; padding: 0 24px; }
        @media (min-width: 768px) { .work-content { padding: 0 40px; } }
        @media (min-width: 1024px) { .work-content { padding: 0 48px 0 40px; } }
        @media (min-width: 1200px) { .work-content { padding: 0 60px 0 48px; } }
        .work-content__label { font-family: var(--font-display); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); padding: 100px 0 32px; }
        .card-section { padding: 24px 0; scroll-margin-top: 90px; }
        .work-card { display: block; text-decoration: none; color: inherit; background: #fff; border-radius: 16px; overflow: hidden; transition: box-shadow 0.3s, transform 0.3s; }
        .work-card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.08); transform: translateY(-4px); }
        .work-card__image { width: 100%; aspect-ratio: 16/10; position: relative; overflow: hidden; }
        .work-card__image-inner { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .work-card:hover .work-card__image-inner { transform: scale(1.03); }
        .work-card__image-label { font-family: var(--font-display); font-size: clamp(28px,4vw,48px); font-weight: 700; color: rgba(255,255,255,0.12); letter-spacing: -0.02em; user-select: none; }
        .work-card__badge { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 5px 12px; border-radius: 100px; font-family: var(--font-body); font-size: 12px; font-weight: 500; color: var(--text-primary); display: flex; align-items: center; gap: 4px; }
        .work-card__badge-star { color: #f59e0b; }
        .work-card__stats { position: absolute; bottom: 16px; left: 16px; display: flex; gap: 6px; flex-wrap: wrap; }
        .work-card__stat { background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 5px 10px; border-radius: 100px; font-family: var(--font-body); font-size: 11px; color: var(--text-secondary); }
        .work-card__stat strong { font-weight: 600; color: var(--text-primary); margin-right: 2px; }
        .work-card__body { padding: 24px 28px 28px; }
        .work-card__name { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; transition: color 0.2s; }
        .work-card:hover .work-card__name { color: var(--text-secondary); }
        .work-card__desc { font-family: var(--font-body); font-size: 15px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 14px; }
        .work-card__tag { display: inline-block; font-family: var(--font-body); font-size: 12px; font-weight: 500; color: var(--text-tertiary); background: var(--bg-secondary); padding: 4px 12px; border-radius: 100px; }
        .article-row { display: block; text-decoration: none; color: inherit; background: #fff; border-radius: 12px; padding: 24px 28px; margin-bottom: 12px; transition: box-shadow 0.2s, transform 0.2s; }
        .article-row:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateX(4px); }
        .article-row__meta { display: flex; gap: 12px; margin-bottom: 6px; }
        .article-row__date, .article-row__read { font-family: var(--font-body); font-size: 12px; color: var(--text-tertiary); }
        .article-row__title { font-family: var(--font-display); font-size: 17px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .article-row__excerpt { font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
        .side-row { background: #fff; border-radius: 12px; padding: 24px 28px; margin-bottom: 12px; transition: box-shadow 0.2s; }
        .side-row:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .side-row__title { font-family: var(--font-display); font-size: 17px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .side-row__desc { font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.5; }
        .side-row__stats { font-family: var(--font-body); font-size: 12px; font-weight: 500; color: var(--text-tertiary); }
        .content-section-label { font-family: var(--font-body); font-size: 13px; font-weight: 600; color: #928f8f; padding: 48px 0 16px; }
        .content-section-label:first-of-type { padding-top: 0; }
      `}</style>

      <section id="work" className="work-layout" aria-label="Work">
        <div className="work-container">
          <aside className="work-sidebar" aria-label="Work navigation">
            <div className="work-sidebar__inner">
              <div className="sidebar-group">
                <p className="sidebar-group__title">Projects</p>
                {(projects || []).map((p) => (
                  <button key={p.id} className={`sidebar-link ${isActive(p.id) ? 'sidebar-link--active' : ''}`} onClick={() => scrollTo(p.id)}>
                    <span className="sidebar-link__text">{p.name}</span>
                  </button>
                ))}
              </div>
              <div className="sidebar-group">
                <p className="sidebar-group__title">Articles</p>
                {(articles || []).map((a, i) => (
                  <button key={i} className={`sidebar-link ${isActive(`article-${i}`) ? 'sidebar-link--active' : ''}`} onClick={() => scrollTo(`article-${i}`)}>
                    <span className="sidebar-link__text">{a.title}</span>
                  </button>
                ))}
              </div>
              <div className="sidebar-group">
                <p className="sidebar-group__title">Side Projects</p>
                {(sideProjects || []).map((sp, i) => (
                  <button key={i} className={`sidebar-link ${isActive(`side-${i}`) ? 'sidebar-link--active' : ''}`} onClick={() => scrollTo(`side-${i}`)}>
                    <span className="sidebar-link__text">{sp.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="work-content">
            <p className="work-content__label reveal">Work</p>
            <p className="content-section-label">Projects</p>
            {(projects || []).map((p) => (
              <div key={p.id} className="card-section" id={`section-${p.id}`} ref={(el) => { sectionRefs.current[p.id] = el }}>
                <Link href={`/project/${p.id}`} className="work-card reveal">
                  <div className="work-card__image">
                    <div className="work-card__image-inner" style={{ background: (p.card_image_url || p.image_url) ? `url(${p.card_image_url || p.image_url}) center/cover` : p.gradient }}>
                      {!(p.card_image_url || p.image_url) && <span className="work-card__image-label">{p.name}</span>}
                    </div>
                    {p.badge_text && (
                      <div className="work-card__badge">
                        <span className="work-card__badge-star">{p.badge_icon}</span>
                        {p.badge_text}
                      </div>
                    )}
                    {p.stats && p.stats.length > 0 && (
                      <div className="work-card__stats">
                        {p.stats.map((s, si) => (
                          <span key={si} className="work-card__stat"><strong>{s.value}</strong> {s.label}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="work-card__body">
                    <h3 className="work-card__name">{p.name}</h3>
                    <p className="work-card__desc">{p.description}</p>
                    <span className="work-card__tag">{p.category}</span>
                  </div>
                </Link>
              </div>
            ))}

            <p className="content-section-label">Articles</p>
            {(articles || []).map((a, i) => (
              <div key={i} className="card-section" id={`section-article-${i}`} ref={(el) => { sectionRefs.current[`article-${i}`] = el }}>
                <a href={a.url} className="article-row reveal">
                  <div className="article-row__meta">
                    <span className="article-row__date">{a.date}</span>
                    <span className="article-row__read">{a.read_time}</span>
                  </div>
                  <h3 className="article-row__title">{a.title}</h3>
                  <p className="article-row__excerpt">{a.excerpt}</p>
                </a>
              </div>
            ))}

            <p className="content-section-label">Side Projects</p>
            {(sideProjects || []).map((sp, i) => (
              <div key={i} className="card-section" id={`section-side-${i}`} ref={(el) => { sectionRefs.current[`side-${i}`] = el }}
                style={{ paddingBottom: i === sideProjects.length - 1 ? 100 : undefined }}>
                <div className="side-row reveal">
                  <h3 className="side-row__title">{sp.title}</h3>
                  <p className="side-row__desc">{sp.description}</p>
                  <span className="side-row__stats">{sp.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
