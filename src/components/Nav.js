'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navLinks = [
  { label: 'Sunkeerth Reddy', href: '/', isHome: true },
  { label: 'Highlights', href: '/#highlights' },
  { label: 'Work', href: '/#work' },
  { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
  { label: 'Get in touch', href: '/#contact' },
]

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (e, link) => {
    if (link.external) return
    if (link.isHome) return
    if (isHome && link.href.startsWith('/#')) {
      e.preventDefault()
      const id = link.href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <>
      <style>{`
        .pill-nav-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 12px 16px;
          pointer-events: none;
        }
        .pill-nav {
          display: flex;
          align-items: center;
          background-color: #fff;
          border-radius: 500px;
          padding: 6px;
          box-shadow: 0 0 3px rgba(0,0,0,0.14), 0 20px 13px -4px rgba(0,0,0,0.06);
          pointer-events: auto;
        }
        .pill-nav__link {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          padding: 0 18px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100px;
          white-space: nowrap;
          transition: background-color 0.15s ease-in-out;
          cursor: pointer;
        }
        .pill-nav__link:hover { background-color: #f5f5f5; }
        .pill-nav__link--home { font-weight: 700; }

        .pill-nav__hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 100px;
          background: none;
          border: none;
          cursor: pointer;
          pointer-events: auto;
          transition: background-color 0.15s ease;
          flex-direction: column;
          gap: 4px;
          padding: 0;
        }
        .pill-nav__hamburger:hover { background-color: #f5f5f5; }
        .pill-nav__hamburger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background-color: var(--text-primary);
          border-radius: 1px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .pill-nav__hamburger--open span:nth-child(1) { transform: rotate(45deg) translate(3px, 3px); }
        .pill-nav__hamburger--open span:nth-child(2) { opacity: 0; }
        .pill-nav__hamburger--open span:nth-child(3) { transform: rotate(-45deg) translate(3.5px, -3.5px); }

        .pill-nav__overlay {
          position: fixed;
          inset: 0;
          background: #fff;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }
        .pill-nav__overlay-link {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: var(--text-primary);
          text-decoration: none;
          opacity: 0;
          transform: translateY(16px);
          animation: pillNavFadeIn 0.4s ease forwards;
        }
        .pill-nav__overlay-link:nth-child(1) { animation-delay: 0ms; }
        .pill-nav__overlay-link:nth-child(2) { animation-delay: 50ms; }
        .pill-nav__overlay-link:nth-child(3) { animation-delay: 100ms; }
        .pill-nav__overlay-link:nth-child(4) { animation-delay: 150ms; }
        .pill-nav__overlay-link:nth-child(5) { animation-delay: 200ms; }
        @keyframes pillNavFadeIn { to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .pill-nav__desktop-links { display: none !important; }
          .pill-nav__hamburger { display: flex; }
          .pill-nav { padding: 6px 6px 6px 16px; gap: 4px; }
        }
        @media (min-width: 769px) {
          .pill-nav__hamburger { display: none !important; }
          .pill-nav__mobile-home { display: none !important; }
        }
        @media (min-width: 1024px) {
          .pill-nav__link { font-size: 15px; padding: 0 20px; }
        }
      `}</style>

      <div className="pill-nav-wrapper">
        <div className="pill-nav">
          <Link href="/" className="pill-nav__link pill-nav__link--home pill-nav__mobile-home">
            Sunkeerth Reddy
          </Link>

          <div className="pill-nav__desktop-links" style={{ display: 'flex', alignItems: 'center' }}>
            {navLinks.map((l) =>
              l.external ? (
                <a key={l.label} href={l.href} className="pill-nav__link" target="_blank" rel="noopener noreferrer">{l.label}</a>
              ) : l.isHome ? (
                <Link key={l.label} href="/" className="pill-nav__link pill-nav__link--home">{l.label}</Link>
              ) : (
                <a key={l.label} href={l.href} className="pill-nav__link" onClick={(e) => handleNavClick(e, l)}>{l.label}</a>
              )
            )}
          </div>

          <button
            className={`pill-nav__hamburger ${mobileOpen ? 'pill-nav__hamburger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="pill-nav__overlay">
          {navLinks.map((l) =>
            l.external ? (
              <a key={l.label} href={l.href} className="pill-nav__overlay-link" target="_blank" rel="noopener noreferrer">{l.label}</a>
            ) : (
              <a key={l.label} href={l.isHome ? '/' : l.href} className="pill-nav__overlay-link"
                onClick={(e) => { handleNavClick(e, l); setMobileOpen(false) }}>{l.label}</a>
            )
          )}
        </div>
      )}
    </>
  )
}
