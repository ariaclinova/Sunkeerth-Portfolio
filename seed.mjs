import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://waeqbowrjunroowbpymc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZXFib3dyanVucm9vd2JweW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODIyMDEsImV4cCI6MjA4OTg1ODIwMX0.IeueSp2V3RN4i4J9dMilR4ULk---7kwlgMpf5xjFwDM'
)

// ---- Projects ----
const projects = [
  {
    id: 'meridian',
    name: 'Meridian',
    tagline: 'Reimagining enterprise data visualization',
    description: 'Designing simpler, smarter ways to understand complex data',
    category: 'Product Design',
    color: '#1a1a2e',
    gradient: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    image_url: null,
    badge_icon: null,
    badge_text: null,
    stats: [{ value: '60%', label: 'faster insights' }, { value: '3.2x', label: 'daily usage' }],
    year: '2025',
    role: 'Lead Product Designer',
    timeline: '6 months',
    team: '2 designers, 4 engineers, 1 PM',
    overview: 'Enterprise teams were drowning in dashboards that obscured more than they revealed. Meridian was built to make complex data feel simple — a visualization platform where insights surface naturally, not through cognitive labor.',
    challenge: 'The existing analytics tool had grown organically over five years. Users faced 200+ chart types, nested configuration panels, and no clear hierarchy of information. Power users had memorized workarounds; new users churned within two weeks.',
    process_steps: [
      { step: 'Research', detail: 'Conducted 24 user interviews across three customer segments.' },
      { step: 'Audit', detail: 'Catalogued every chart type. Found that 12 core visualizations covered 90% of use cases.' },
      { step: 'Framework', detail: 'Developed an "intent-first" interaction model.' },
      { step: 'Prototype', detail: 'Built interactive prototypes for three concept directions.' },
      { step: 'Design System', detail: 'Created a component library for data visualization.' },
      { step: 'Iteration', detail: 'Ran three rounds of usability testing during build.' },
    ],
    impact: [
      { metric: '60%', label: 'Reduction in time-to-insight' },
      { metric: '3.2x', label: 'Increase in daily active usage' },
      { metric: '45%', label: 'Decrease in support tickets' },
      { metric: '92', label: 'NPS score (up from 34)' },
    ],
    next_project: 'pulse',
    sort_order: 0,
  },
  {
    id: 'pulse',
    name: 'Pulse',
    tagline: 'A health tracking experience that adapts to you',
    description: 'Personal health companion that learns what matters to you',
    category: 'Mobile Design',
    color: '#1b3a4b',
    gradient: 'linear-gradient(145deg, #1b3a4b 0%, #2d6187 50%, #4a90b8 100%)',
    image_url: null,
    badge_icon: '★',
    badge_text: '4.8 App Store',
    stats: [{ value: '2.8x', label: 'retention' }, { value: '74%', label: 'daily engagement' }],
    year: '2025',
    role: 'Product Designer',
    timeline: '4 months',
    team: '1 designer, 3 engineers, 1 data scientist',
    overview: 'Health apps assume everyone cares about the same metrics. Pulse was designed to learn what matters to each individual and surface only what is relevant.',
    challenge: 'Existing health trackers overwhelmed users with data they did not ask for. Engagement dropped sharply after week two.',
    process_steps: [
      { step: 'Research', detail: 'Analyzed usage patterns from 10,000 anonymized accounts.' },
      { step: 'Concept', detail: 'Designed an adaptive interface that observes which metrics users check most frequently.' },
      { step: 'Prototype', detail: 'Built a functional prototype with simulated adaptation logic.' },
      { step: 'Refinement', detail: 'Tuned the adaptation algorithm based on feedback.' },
    ],
    impact: [
      { metric: '2.8x', label: 'Week-4 retention improvement' },
      { metric: '74%', label: 'Users engaged daily (up from 31%)' },
      { metric: '4.8', label: 'App Store rating' },
    ],
    next_project: 'fabric',
    sort_order: 1,
  },
  {
    id: 'fabric',
    name: 'Fabric',
    tagline: 'Design system for a fintech platform',
    description: 'Unifying five product teams under one design language',
    category: 'Systems Design',
    color: '#2a2a2a',
    gradient: 'linear-gradient(145deg, #2a2a2a 0%, #3d3d3d 50%, #555555 100%)',
    image_url: null,
    badge_icon: null,
    badge_text: null,
    stats: [{ value: '86', label: 'components' }, { value: '75%', label: 'faster handoff' }],
    year: '2024',
    role: 'Design Systems Lead',
    timeline: '8 months',
    team: '3 designers, 2 engineers',
    overview: 'A growing fintech startup had five product teams shipping inconsistent interfaces. Fabric unified their design language into a single, flexible system that scaled with the organization.',
    challenge: 'Each product team had developed its own component patterns. The same action — confirming a transaction — looked and behaved differently across four products.',
    process_steps: [
      { step: 'Inventory', detail: 'Audited all five products. Documented 340 unique components.' },
      { step: 'Consolidation', detail: 'Reduced to 86 core components through collaborative workshops.' },
      { step: 'Architecture', detail: 'Designed a token-based system with three tiers.' },
      { step: 'Documentation', detail: 'Built a living documentation site with usage guidelines.' },
    ],
    impact: [
      { metric: '75%', label: 'Reduction in design-to-dev handoff time' },
      { metric: '86', label: 'Components shipped (from 340 unique)' },
      { metric: '4 wks', label: 'To onboard a new product team' },
    ],
    next_project: 'horizon',
    sort_order: 2,
  },
  {
    id: 'horizon',
    name: 'Horizon',
    tagline: 'Onboarding flow that reduced drop-off by 40%',
    description: 'Getting users to their first value moment in under 5 minutes',
    category: 'UX Design',
    color: '#3d2c5e',
    gradient: 'linear-gradient(145deg, #3d2c5e 0%, #5b4a8a 50%, #7b6aaa 100%)',
    image_url: null,
    badge_icon: null,
    badge_text: null,
    stats: [{ value: '40%', label: 'less drop-off' }, { value: '5 min', label: 'to first value' }],
    year: '2024',
    role: 'UX Designer',
    timeline: '3 months',
    team: '1 designer, 2 engineers, 1 analyst',
    overview: 'A B2B SaaS product was losing 60% of trial signups before they completed setup. Horizon redesigned the onboarding experience to get users to their first value moment within five minutes.',
    challenge: 'The existing onboarding was a 14-step wizard that tried to configure everything upfront. Users wanted to explore the product, not fill out forms.',
    process_steps: [
      { step: 'Analysis', detail: 'Mapped the existing funnel. Identified three critical drop-off points.' },
      { step: 'Redesign', detail: 'Collapsed onboarding to 4 essential steps.' },
      { step: 'Testing', detail: 'A/B tested with 2,000 new signups over three weeks.' },
    ],
    impact: [
      { metric: '40%', label: 'Reduction in onboarding drop-off' },
      { metric: '5 min', label: 'Average time to first value' },
      { metric: '28%', label: 'Increase in trial-to-paid conversion' },
    ],
    next_project: 'aether',
    sort_order: 3,
  },
  {
    id: 'aether',
    name: 'Aether',
    tagline: 'AI-powered creative tool for teams',
    description: 'Where AI handles the tedious, and humans stay in control of taste',
    category: 'Product Design',
    color: '#0d1b2a',
    gradient: 'linear-gradient(145deg, #0d1b2a 0%, #1b2838 50%, #2a3f5f 100%)',
    image_url: null,
    badge_icon: null,
    badge_text: null,
    stats: [{ value: '35%', label: 'faster production' }, { value: '89%', label: 'felt in control' }],
    year: '2025',
    role: 'Product Designer',
    timeline: '5 months',
    team: '2 designers, 5 engineers, 1 ML engineer',
    overview: 'Aether brings AI into the creative workflow without replacing the creator. A collaborative tool where AI handles the tedious parts while humans stay in control of intent and taste.',
    challenge: 'AI creative tools either do too much or too little. The design challenge was finding the right level of AI involvement — useful without being presumptuous.',
    process_steps: [
      { step: 'Exploration', detail: 'Interviewed 20 designers about their relationship with AI tools.' },
      { step: 'Framework', detail: 'Developed a "confidence spectrum" model for AI suggestions.' },
      { step: 'Design', detail: 'Created an interface where AI assistance is ambient rather than modal.' },
      { step: 'Validation', detail: 'Ran a week-long beta with 50 creative professionals.' },
    ],
    impact: [
      { metric: '35%', label: 'Faster asset production' },
      { metric: '89%', label: 'Users reported feeling "in control"' },
      { metric: '4.6', label: 'Satisfaction score (out of 5)' },
    ],
    next_project: 'meridian',
    sort_order: 4,
  },
]

// ---- Highlights ----
const highlights = [
  { emoji: '🏆', title: 'Design Excellence Award', description: 'Meridian — Enterprise Product of the Year', sort_order: 0 },
  { emoji: '📱', title: 'App of the Day — App Store', description: 'Pulse health tracking app, 2025', sort_order: 1 },
  { emoji: '📝', title: 'Featured in UX Collective', description: 'Essential Design Portfolios list', sort_order: 2 },
  { emoji: '🎤', title: 'Speaker — Design Systems Conference', description: 'Building Fabric: Scaling design across five teams', sort_order: 3 },
  { emoji: '✍️', title: 'Published in Smashing Magazine', description: 'The case for intent-first data visualization', sort_order: 4 },
  { emoji: '🎙️', title: 'Guest — Design Better Podcast', description: 'On designing AI tools that respect the creator', sort_order: 5 },
]

// ---- Articles ----
const articles = [
  { title: 'The power of restraint in product design', excerpt: 'Why removing features can be more impactful than adding them.', date: 'Feb 2026', read_time: '6 min read', url: '#', sort_order: 0 },
  { title: 'Building design systems that teams actually use', excerpt: 'Lessons from scaling Fabric across five product teams.', date: 'Nov 2025', read_time: '8 min read', url: '#', sort_order: 1 },
  { title: 'Designing with AI without losing the human', excerpt: 'How to keep creative control when your tools get smarter.', date: 'Aug 2025', read_time: '5 min read', url: '#', sort_order: 2 },
]

// ---- Side Projects ----
const sideProjects = [
  { title: 'Design Critique Club', description: 'Monthly design review sessions for product designers', stats: '+200 members · 12 sessions', sort_order: 0 },
  { title: 'Component Patterns', description: 'Open-source collection of UI patterns with rationale', stats: '45 patterns · 1.2k stars', sort_order: 1 },
  { title: 'Portfolio Reviews', description: 'Free portfolio feedback for junior designers', stats: '80+ reviews · ongoing', sort_order: 2 },
]

async function seed() {
  console.log('Seeding projects...')
  const { error: pErr } = await supabase.from('projects').upsert(projects, { onConflict: 'id' })
  if (pErr) console.error('Projects error:', pErr.message)
  else console.log(`  ✓ ${projects.length} projects`)

  console.log('Seeding highlights...')
  const { error: hErr } = await supabase.from('highlights').insert(highlights)
  if (hErr) console.error('Highlights error:', hErr.message)
  else console.log(`  ✓ ${highlights.length} highlights`)

  console.log('Seeding articles...')
  const { error: aErr } = await supabase.from('articles').insert(articles)
  if (aErr) console.error('Articles error:', aErr.message)
  else console.log(`  ✓ ${articles.length} articles`)

  console.log('Seeding side projects...')
  const { error: sErr } = await supabase.from('side_projects').insert(sideProjects)
  if (sErr) console.error('Side projects error:', sErr.message)
  else console.log(`  ✓ ${sideProjects.length} side projects`)

  console.log('\nDone! Refresh your site to see the data.')
}

seed()
