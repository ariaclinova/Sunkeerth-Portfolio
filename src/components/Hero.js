'use client'
import { useEffect, useState } from 'react'

export default function Hero({ config }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const headline = config?.hero_headline || 'Sunkeerth Reddy is'
  const headlineSec = config?.hero_headline_secondary || 'a Product Designer crafting interfaces where complexity disappears'
  const subline = config?.hero_subline || 'Product Designer. Systems thinker. Clarity-driven.'
  const linkedin = config?.social_linkedin || 'https://linkedin.com'
  const dribbble = config?.social_dribbble || 'https://dribbble.com'
  const medium = config?.social_medium || 'https://medium.com'
  const twitter = config?.social_twitter || 'https://x.com'

  return (
    <>
      <style>{`
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 24px 80px; }
        .hero__headline { font-family: var(--font-display); font-size: clamp(28px, 5vw, 52px); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); max-width: 780px; margin: 0; opacity: 0; transform: translateY(25px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .hero__headline.show { opacity: 1; transform: translateY(0); }
        .hero__headline span { color: var(--text-secondary); }
        .hero__sub { font-family: var(--font-body); font-size: clamp(15px,2vw,18px); font-weight: 400; color: var(--text-tertiary); margin-top: 24px; opacity: 0; transform: translateY(20px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.12s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.12s; }
        .hero__sub.show { opacity: 1; transform: translateY(0); }
        .hero__socials { display: flex; align-items: center; gap: 24px; margin-top: 36px; opacity: 0; transform: translateY(15px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.24s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.24s; }
        .hero__socials.show { opacity: 1; transform: translateY(0); }
        .hero__social-link { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: var(--bg-secondary); color: var(--text-secondary); transition: background-color 0.2s, color 0.2s, transform 0.2s; }
        .hero__social-link:hover { background: var(--text-primary); color: var(--text-inverse); transform: translateY(-2px); }
        .hero__social-link svg { width: 18px; height: 18px; fill: currentColor; }
        @media (min-width: 768px) { .hero { padding: 140px 40px 100px; } }
      `}</style>

      <section className="hero" aria-label="Introduction">
        <h1 className={`hero__headline ${loaded ? 'show' : ''}`}>
          {headline} <span>{headlineSec}</span>
        </h1>
        <p className={`hero__sub ${loaded ? 'show' : ''}`}>{subline}</p>
      </section>
    </>
  )
}
