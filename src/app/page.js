export const dynamic = 'force-dynamic'

import { getProjects, getHighlights, getArticles, getSideProjects, getSiteConfig } from '@/lib/data'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Logos from '@/components/Logos'
import Highlights from '@/components/Highlights'
import Work from '@/components/Work'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollRevealProvider from '@/components/ScrollRevealProvider'

export default async function Home() {
  const [projects, highlights, articles, sideProjects, config] = await Promise.all([
    getProjects(),
    getHighlights(),
    getArticles(),
    getSideProjects(),
    getSiteConfig(),
  ])

  const projectNames = projects.map((p) => p.name)

  return (
    <ScrollRevealProvider>
      <a href="#work" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero config={config} />
        <Logos companies={projectNames} />
        <Work projects={projects} articles={articles} sideProjects={sideProjects} />
        <Contact config={config} />
      </main>
      <Footer config={config} />
    </ScrollRevealProvider>
  )
}
