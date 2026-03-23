export default function Highlights({ highlights }) {
  if (!highlights || highlights.length === 0) return null

  return (
    <>
      <style>{`
        .highlights { padding: 100px 24px; max-width: 1200px; margin: 0 auto; }
        .highlights__label { font-family: var(--font-display); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 48px; }
        .highlights__grid { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .hl-card { display: flex; align-items: flex-start; gap: 16px; padding: 28px 24px; background: var(--bg-primary); transition: background-color 0.2s; }
        .hl-card:hover { background: var(--bg-secondary); }
        .hl-card__emoji { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
        .hl-card__title { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
        .hl-card__desc { font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); line-height: 1.4; }
        @media (min-width: 768px) { .highlights { padding: 100px 40px; } .highlights__grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .highlights { padding: 100px 60px; } .highlights__grid { grid-template-columns: 1fr 1fr 1fr; } }
      `}</style>
      <section id="highlights" className="highlights" aria-label="Highlights">
        <div className="reveal"><p className="highlights__label">Highlights</p></div>
        <div className="highlights__grid stagger-reveal reveal">
          {highlights.map((h, i) => (
            <div className="hl-card" key={i}>
              <span className="hl-card__emoji">{h.emoji}</span>
              <div>
                <p className="hl-card__title">{h.title}</p>
                <p className="hl-card__desc">{h.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
