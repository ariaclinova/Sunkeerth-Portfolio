-- ============================================
-- Supabase Schema for Sunkeerth Reddy Portfolio
-- Run this in your Supabase SQL Editor
-- ============================================

-- Projects (case studies)
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT,
  color TEXT,
  gradient TEXT,
  image_url TEXT,
  badge_icon TEXT,
  badge_text TEXT,
  stats JSONB DEFAULT '[]',
  year TEXT,
  role TEXT,
  timeline TEXT,
  team TEXT,
  overview TEXT,
  challenge TEXT,
  process_steps JSONB DEFAULT '[]',
  impact JSONB DEFAULT '[]',
  next_project TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Highlights / Recognition
CREATE TABLE highlights (
  id SERIAL PRIMARY KEY,
  emoji TEXT,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Articles
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  date TEXT,
  read_time TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Side Projects
CREATE TABLE side_projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stats TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site Config (single row)
CREATE TABLE site_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_headline TEXT,
  hero_headline_secondary TEXT,
  hero_subline TEXT,
  contact_headline TEXT,
  footer_copy TEXT,
  logo_companies TEXT,
  social_linkedin TEXT,
  social_dribbble TEXT,
  social_medium TEXT,
  social_twitter TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default site config
INSERT INTO site_config (hero_headline, hero_headline_secondary, hero_subline, contact_headline, footer_copy, logo_companies, social_linkedin, social_dribbble, social_medium, social_twitter)
VALUES (
  'Sunkeerth Reddy is',
  'a Product Designer crafting interfaces where complexity disappears',
  'Product Designer. Systems thinker. Clarity-driven.',
  'Want to get in touch? Drop me a line',
  '© 2026 Sunkeerth Reddy',
  'Meridian,Pulse,Fabric,Horizon,Aether,Construct',
  'https://linkedin.com',
  'https://dribbble.com',
  'https://medium.com',
  'https://x.com'
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE side_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key can read)
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read" ON highlights FOR SELECT USING (true);
CREATE POLICY "Public read" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read" ON side_projects FOR SELECT USING (true);
CREATE POLICY "Public read" ON site_config FOR SELECT USING (true);

-- Authenticated write access (service role or authenticated)
CREATE POLICY "Admin write" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write" ON highlights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write" ON side_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write" ON site_config FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for images
-- (Run this separately or in Supabase Dashboard > Storage > New Bucket)
-- Bucket name: images
-- Public: true
