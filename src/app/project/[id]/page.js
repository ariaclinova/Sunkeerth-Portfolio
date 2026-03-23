export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getProject, getProjects } from '@/lib/data'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollRevealProvider from '@/components/ScrollRevealProvider'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const project = await getProject(id)
  return {
    title: project ? `${project.name} — Sunkeerth Reddy` : 'Project — Sunkeerth Reddy',
    description: project?.description || '',
  }
}

function hasImages(images) {
  return Array.isArray(images) && images.some((img) => img?.url)
}

function ImageGallery({ images }) {
  if (!hasImages(images)) return null
  const items = images.filter((img) => img?.url)

  // Group images into rows based on layout
  const rows = []
  let currentRow = []

  items.forEach((img) => {
    const layout = img.layout || 'full'
    if (layout === 'full') {
      if (currentRow.length > 0) { rows.push(currentRow); currentRow = [] }
      rows.push([img])
    } else {
      currentRow.push(img)
      const maxInRow = layout === 'third' ? 3 : 2
      if (currentRow.length >= maxInRow) { rows.push(currentRow); currentRow = [] }
    }
  })
  if (currentRow.length > 0) rows.push(currentRow)

  return (
    <div className="cs-gallery">
      {rows.map((row, ri) => (
        <div className="cs-gallery__row" key={ri}>
          {row.map((img, ii) => (
            <div key={ii} className={`cs-gallery__item cs-gallery__item--${img.layout || 'full'}`}>
              <img src={img.url} alt={img.caption || ''} loading="lazy" />
              {img.caption && <p className="cs-gallery__caption">{img.caption}</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default async function CaseStudyPage({ params }) {
  const { id } = await params
  const [project, projects] = await Promise.all([
    getProject(id),
    getProjects(),
  ])

  if (!project) {
    return (
      <>
        <Nav />
        <div style={{ padding: '200px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Project not found.</p>
          <Link href="/" style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: 16, display: 'inline-block' }}>Back to home</Link>
        </div>
      </>
    )
  }

  const nextProject = project.next_project
    ? projects.find((p) => p.id === project.next_project)
    : null

  return (
    <ScrollRevealProvider>
      <div className="cs-page">
      <style>{`
        .cs-nav-spacer { height: 64px; }
        .cs-hero { width: 100%; min-height: 480px; position: relative; display: flex; align-items: flex-end; }
        .cs-hero__bg { position: absolute; inset: 0; }
        .cs-hero__content { position: relative; z-index: 2; padding: 48px 24px; width: 100%; max-width: 1200px; margin: 0 auto; }
        .cs-hero__back { font-family: var(--font-body); font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 32px; transition: color 0.2s; }
        .cs-hero__back:hover { color: #fff; }
        .cs-hero__title { font-family: var(--font-display); font-size: clamp(32px,5vw,56px); font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0 0 12px; }
        .cs-hero__desc { font-family: var(--font-body); font-size: 18px; color: rgba(255,255,255,0.7); max-width: 540px; line-height: 1.5; }
        .cs-hero__badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); padding: 6px 16px; border-radius: 100px; font-family: var(--font-body); font-size: 13px; color: rgba(255,255,255,0.9); margin-top: 20px; }
        .cs-body { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .cs-meta { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; padding: 56px 0; border-bottom: 1px solid var(--border); }
        .cs-meta__label { font-family: var(--font-body); font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 4px; }
        .cs-meta__value { font-family: var(--font-body); font-size: 15px; color: var(--text-primary); font-weight: 500; }
        .cs-section { padding: 64px 0; border-bottom: 1px solid var(--border); }
        .cs-section:last-of-type { border-bottom: none; }
        .cs-section__label { font-family: var(--font-display); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 24px; }
        .cs-section__text { font-family: var(--font-body); font-size: 16px; color: var(--text-secondary); line-height: 1.7; max-width: 680px; }
        .cs-image-placeholder { width: 100%; aspect-ratio: 16/9; border-radius: 12px; margin: 40px 0 0; background: linear-gradient(145deg, var(--bg-secondary), var(--border-light)); }
        .cs-gallery { margin-top: 40px; }
        .cs-gallery__row { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
        .cs-gallery__item { border-radius: 12px; overflow: hidden; background: var(--bg-secondary); }
        .cs-gallery__item--full { width: 100%; }
        .cs-gallery__item--half { width: calc(50% - 8px); }
        .cs-gallery__item--third { width: calc(33.333% - 11px); }
        .cs-gallery__item img { width: 100%; height: auto; display: block; }
        .cs-gallery__caption { font-family: var(--font-body); font-size: 13px; color: var(--text-tertiary); text-align: center; padding: 10px 12px; }
        @media (max-width: 640px) { .cs-gallery__item--half, .cs-gallery__item--third { width: 100%; } }
        .cs-process-steps { display: flex; flex-direction: column; gap: 28px; }
        .cs-step { display: grid; grid-template-columns: 36px 1fr; gap: 16px; }
        .cs-step__num { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-tertiary); padding-top: 2px; }
        .cs-step__title { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
        .cs-step__detail { font-family: var(--font-body); font-size: 15px; color: var(--text-secondary); line-height: 1.6; max-width: 680px; }
        .cs-impact-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 32px; }
        .cs-impact__metric { font-family: var(--font-display); font-size: clamp(28px,4vw,44px); font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }
        .cs-impact__label { font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); margin-top: 4px; }
        .cs-next { padding: 80px 0; text-align: center; }
        .cs-next__label { font-family: var(--font-body); font-size: 13px; font-weight: 500; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
        .cs-next__link { font-family: var(--font-display); font-size: clamp(24px,3vw,36px); font-weight: 700; color: var(--text-primary); text-decoration: none; transition: color 0.2s; }
        .cs-next__link:hover { color: var(--text-secondary); }
        @media (min-width: 768px) { .cs-hero__content { padding: 64px 40px; } .cs-body { padding: 0 40px; } .cs-meta { grid-template-columns: repeat(4,1fr); } .cs-impact-grid { grid-template-columns: repeat(3,1fr); } }
        @media (min-width: 1024px) { .cs-hero__content { padding: 80px 60px; } .cs-body { padding: 0 60px; } .cs-hero { min-height: 540px; } .cs-impact-grid { grid-template-columns: repeat(4,1fr); } }
      `}</style>

      <Nav />
      <main>
        <div className="cs-nav-spacer" style={{ background: project.color || '#1a1a2e' }} />
        <section className="cs-hero">
          <div className="cs-hero__bg" style={{ background: project.image_url ? `url(${project.image_url}) center/cover` : project.gradient }} />
          <div className="cs-hero__content">
            <Link href="/" className="cs-hero__back">&larr; Back to work</Link>
            <h1 className="cs-hero__title">{project.name}</h1>
            <p className="cs-hero__desc">{project.description}</p>
            {project.badge_text && <span className="cs-hero__badge">{project.badge_icon} {project.badge_text}</span>}
          </div>
        </section>

        <div className="cs-body">
          <div className="cs-meta reveal">
            <div><p className="cs-meta__label">Role</p><p className="cs-meta__value">{project.role}</p></div>
            <div><p className="cs-meta__label">Timeline</p><p className="cs-meta__value">{project.timeline}</p></div>
            <div><p className="cs-meta__label">Team</p><p className="cs-meta__value">{project.team}</p></div>
            <div><p className="cs-meta__label">Year</p><p className="cs-meta__value">{project.year}</p></div>
          </div>

          {/* Hero Images */}
          <ImageGallery images={project.hero_images} />

          <div className="cs-section reveal">
            <p className="cs-section__label">Overview</p>
            <p className="cs-section__text">{project.overview}</p>
            <ImageGallery images={project.overview_images} />
          </div>

          <div className="cs-section reveal">
            <p className="cs-section__label">Challenge</p>
            <p className="cs-section__text">{project.challenge}</p>
            <ImageGallery images={project.challenge_images} />
          </div>

          {(project.process_steps || []).length > 0 && (
            <div className="cs-section reveal">
              <p className="cs-section__label">Process</p>
              <div className="cs-process-steps">
                {(project.process_steps || []).map((step, i) => (
                  <div className="cs-step" key={i}>
                    <span className="cs-step__num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="cs-step__title">{step.step}</p>
                      <p className="cs-step__detail">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <ImageGallery images={project.process_images} />
            </div>
          )}

          {/* Solution Showcase */}
          {hasImages(project.solution_images) && (
            <div className="cs-section reveal">
              <p className="cs-section__label">Solution</p>
              <ImageGallery images={project.solution_images} />
            </div>
          )}

          {(project.impact || []).length > 0 && (
            <div className="cs-section reveal">
              <p className="cs-section__label">Impact</p>
              <div className="cs-impact-grid">
                {(project.impact || []).map((item, i) => (
                  <div key={i}>
                    <p className="cs-impact__metric">{item.metric}</p>
                    <p className="cs-impact__label">{item.label}</p>
                  </div>
                ))}
              </div>
              <ImageGallery images={project.impact_images} />
            </div>
          )}

          {nextProject && (
            <div className="cs-next reveal">
              <p className="cs-next__label">Next Project</p>
              <Link href={`/project/${nextProject.id}`} className="cs-next__link">{nextProject.name} &rarr;</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      </div>
    </ScrollRevealProvider>
  )
}
