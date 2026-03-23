export default function Footer({ config }) {
  return (
    <>
      <style>{`
        .footer { padding: 48px 24px; border-top: 1px solid var(--border); }
        .footer__inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .footer__socials { display: flex; align-items: center; gap: 32px; }
        .footer__social-link { font-family: var(--font-body); font-size: 14px; color: var(--text-tertiary); text-decoration: none; transition: color 0.2s; }
        .footer__social-link:hover { color: var(--text-primary); }
        .footer__copy { font-family: var(--font-body); font-size: 13px; color: var(--text-tertiary); }
        @media (min-width: 768px) { .footer { padding: 48px 40px; } .footer__inner { flex-direction: row; justify-content: space-between; } }
      `}</style>
      <footer className="footer" role="contentinfo">
        <div className="footer__inner">
          <div className="footer__socials">
            <a href={config?.social_twitter || 'https://x.com'} target="_blank" rel="noopener noreferrer" className="footer__social-link">Twitter</a>
            <a href={config?.social_dribbble || 'https://dribbble.com'} target="_blank" rel="noopener noreferrer" className="footer__social-link">Dribbble</a>
            <a href={config?.social_linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" className="footer__social-link">LinkedIn</a>
            <a href={config?.social_medium || 'https://medium.com'} target="_blank" rel="noopener noreferrer" className="footer__social-link">Medium</a>
          </div>
          <span className="footer__copy">{config?.footer_copy || '© 2026 Sunkeerth Reddy'}</span>
        </div>
      </footer>
    </>
  )
}
