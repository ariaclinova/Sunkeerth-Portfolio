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
        <div className={`hero__socials ${loaded ? 'show' : ''}`}>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href={dribbble} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="Dribbble">
            <svg viewBox="0 0 24 24"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702A9.63 9.63 0 0012 2.006c-.825 0-1.63.105-2.4.3v-.254zm10.335 3.483c-.218.29-1.91 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/></svg>
          </a>
          <a href={medium} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="Medium">
            <svg viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
          </a>
          <a href={twitter} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="X / Twitter">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </section>
    </>
  )
}
