'use client'
import { useState } from 'react'

export default function Contact({ config }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const headline = config?.contact_headline || 'Want to get in touch? Drop me a line'

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <>
      <style>{`
        .contact { padding: 100px 24px; max-width: 1200px; margin: 0 auto; }
        .contact__label { font-family: var(--font-display); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 16px; }
        .contact__headline { font-family: var(--font-display); font-size: clamp(24px,4vw,40px); font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 48px; max-width: 500px; line-height: 1.15; }
        .contact__form { display: flex; flex-direction: column; gap: 20px; max-width: 520px; }
        .contact__field { display: flex; flex-direction: column; gap: 6px; }
        .contact__field label { font-family: var(--font-body); font-size: 13px; font-weight: 500; color: var(--text-secondary); }
        .contact__field input, .contact__field textarea { font-family: var(--font-body); font-size: 15px; padding: 12px 16px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--bg-primary); color: var(--text-primary); transition: border-color 0.2s; outline: none; }
        .contact__field input:focus, .contact__field textarea:focus { border-color: var(--text-primary); }
        .contact__field textarea { min-height: 140px; resize: vertical; }
        .contact__submit { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--text-inverse); background: var(--text-primary); padding: 14px 32px; border-radius: 100px; border: none; cursor: pointer; transition: opacity 0.2s, transform 0.2s; align-self: flex-start; }
        .contact__submit:hover { opacity: 0.85; transform: translateY(-1px); }
        .contact__success { font-family: var(--font-body); font-size: 16px; color: var(--text-secondary); padding: 32px 0; }
        .contact__success strong { color: var(--text-primary); font-weight: 600; }
        @media (min-width: 768px) { .contact { padding: 100px 40px; } }
        @media (min-width: 1024px) { .contact { padding: 100px 60px; } }
      `}</style>
      <section id="contact" className="contact" aria-label="Contact">
        <div className="reveal">
          <p className="contact__label">Contact</p>
          <h2 className="contact__headline">{headline}</h2>
        </div>
        {submitted ? (
          <div className="contact__success"><p><strong>Thanks for reaching out.</strong> I'll get back to you soon.</p></div>
        ) : (
          <form className="contact__form reveal" onSubmit={handleSubmit}>
            <div className="contact__field"><label htmlFor="name">Name</label><input type="text" id="name" name="name" value={form.name} onChange={handleChange} required autoComplete="name" /></div>
            <div className="contact__field"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" /></div>
            <div className="contact__field"><label htmlFor="message">Message</label><textarea id="message" name="message" value={form.message} onChange={handleChange} required /></div>
            <button type="submit" className="contact__submit">Send Message</button>
          </form>
        )}
      </section>
    </>
  )
}
