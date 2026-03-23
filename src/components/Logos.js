export default function Logos({ companies }) {
  const items = companies || ['Meridian', 'Pulse', 'Fabric', 'Horizon', 'Aether', 'Construct']

  return (
    <>
      <style>{`
        .logos { padding: 48px 24px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .logos__inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 40px 48px; }
        .logos__item { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--text-tertiary); letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.5; transition: opacity 0.3s; }
        .logos__item:hover { opacity: 0.8; }
        @media (min-width: 768px) { .logos { padding: 56px 40px; } .logos__inner { gap: 40px 64px; } .logos__item { font-size: 13px; } }
      `}</style>
      <section className="logos reveal" aria-label="Companies">
        <div className="logos__inner">
          {items.map((c) => <span key={c} className="logos__item">{c}</span>)}
        </div>
      </section>
    </>
  )
}
