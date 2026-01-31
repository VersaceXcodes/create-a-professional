-- COMMANDS FOR DB TABLES

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content types
CREATE TYPE content_type AS ENUM ('article', 'report', 'commentary');
CREATE TYPE region_type AS ENUM ('gcc', 'north_africa', 'levant', 'general');
CREATE TYPE industry_type AS ENUM ('energy', 'finance', 'infrastructure', 'technology', 'real_estate', 'general');
CREATE TYPE service_type AS ENUM ('investment_advisory', 'market_research', 'corporate_strategy', 'risk_analysis');

-- Articles and Reports
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255),
  featured_image VARCHAR(500),
  content_type content_type NOT NULL,
  region region_type DEFAULT 'general',
  industry industry_type DEFAULT 'general',
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Market highlights
CREATE TABLE IF NOT EXISTS market_highlights (
  id SERIAL PRIMARY KEY,
  region region_type NOT NULL,
  metric_name VARCHAR(255) NOT NULL,
  metric_value VARCHAR(255) NOT NULL,
  trend VARCHAR(50),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job listings
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media library
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(500) NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  url VARCHAR(1000) NOT NULL,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_region ON content(region);
CREATE INDEX IF NOT EXISTS idx_content_industry ON content(industry);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(published_at);
CREATE INDEX IF NOT EXISTS idx_content_featured ON content(is_featured);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);

-- COMMANDS FOR DB SEED
-- Sample market highlights
INSERT INTO market_highlights (region, metric_name, metric_value, trend, description, display_order) VALUES
('gcc', 'GDP Growth', '+4.2%', 'up', 'Strong economic expansion driven by oil recovery and diversification', 1),
('gcc', 'FDI Inflows', '$45.3B', 'up', 'Record foreign investment in non-oil sectors', 2),
('gcc', 'Market Cap', '$3.1T', 'stable', 'Combined stock market capitalization', 3),
('north_africa', 'GDP Growth', '+3.8%', 'up', 'Steady growth across key economies', 1),
('north_africa', 'Trade Volume', '$285B', 'up', 'Increased regional and international trade', 2),
('north_africa', 'Infrastructure Investment', '$67B', 'up', 'Major projects in transport and energy', 3),
('levant', 'GDP Growth', '+2.5%', 'stable', 'Gradual economic recovery', 1),
('levant', 'Tech Sector Growth', '+15%', 'up', 'Rapid expansion in digital services', 2),
('levant', 'Remittances', '$22B', 'stable', 'Steady flow supporting local economies', 3)
ON CONFLICT DO NOTHING;

-- Sample featured content
INSERT INTO content (title, slug, excerpt, content, author, content_type, region, industry, is_featured, published_at) VALUES
('Saudi Vision 2030: Progress and Opportunities', 'saudi-vision-2030-progress', 'An in-depth analysis of Saudi Arabia''s economic transformation and investment opportunities across key sectors.', 'Saudi Arabia''s Vision 2030 continues to reshape the Kingdom''s economic landscape, creating unprecedented opportunities for investors and businesses. The diversification away from oil dependency has accelerated, with significant progress in tourism, entertainment, technology, and renewable energy sectors.\n\nKey developments include the NEOM project, Red Sea tourism initiatives, and massive infrastructure investments. The regulatory environment has become more business-friendly, with reforms in foreign ownership rules and streamlined licensing procedures.\n\nFor investors, the focus areas include: technology and digital transformation, renewable energy projects, healthcare infrastructure, and entertainment ventures. The government''s commitment to reform and substantial financial backing make this an attractive market for long-term strategic investments.', 'Dr. Sarah Al-Mansouri', 'article', 'gcc', 'general', TRUE, NOW() - INTERVAL '2 days'),

('North Africa Renewable Energy Boom', 'north-africa-renewable-energy', 'Morocco, Egypt, and Algeria lead the region in renewable energy investments, with over $25B in projects planned through 2026.', 'North Africa is emerging as a global leader in renewable energy development, driven by abundant solar and wind resources, supportive government policies, and international partnerships.\n\nMorocco''s Noor solar complex remains one of the world''s largest concentrated solar power plants, while Egypt''s renewable energy targets aim for 42% of electricity generation by 2035. Algeria is developing major solar projects to diversify its energy mix.\n\nInvestment opportunities span solar farms, wind projects, green hydrogen production, and supporting infrastructure. European energy companies are particularly active, seeking to secure future energy supplies while supporting decarbonization goals.', 'Ahmed Benali', 'article', 'north_africa', 'energy', TRUE, NOW() - INTERVAL '5 days'),

('Levant Tech Sector: The New Innovation Hub', 'levant-tech-innovation-hub', 'Despite challenges, Lebanon, Jordan, and Palestine emerge as unexpected tech innovation centers with growing startup ecosystems.', 'The Levant region is witnessing a remarkable technology boom, with highly educated populations and entrepreneurial spirit driving innovation despite geopolitical challenges.\n\nJordan has established itself as a regional tech hub, with strong government support for startups and a thriving software development sector. Lebanese entrepreneurs, despite economic difficulties, continue to build globally competitive tech companies, often with regional and international funding.\n\nKey sectors include fintech, e-commerce, edtech, and digital services. The region benefits from strong educational systems producing tech talent, lower operational costs compared to the Gulf, and entrepreneurs experienced in operating in complex environments.', 'Maya Khoury', 'article', 'levant', 'technology', TRUE, NOW() - INTERVAL '1 day'),

('GCC Banking Sector 2024 Outlook', 'gcc-banking-outlook-2024', 'Regional banks show strong fundamentals with high liquidity, improved asset quality, and digital transformation momentum.', 'The GCC banking sector enters 2024 with robust health indicators and strong growth prospects. High oil prices have bolstered government deposits, while economic diversification has broadened the customer base beyond traditional sectors.\n\nDigital transformation remains a priority, with major investments in fintech partnerships, digital banking platforms, and AI-powered services. Saudi Arabia and UAE lead in banking innovation, with several banks launching digital-only subsidiaries.\n\nKey trends include consolidation through mergers, expansion of Islamic banking products, growth in SME lending, and increased focus on sustainable finance. Cross-border expansion within the GCC and into select African markets is also gaining momentum.', 'Khalid Al-Thani', 'report', 'gcc', 'finance', TRUE, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Sample job listings
INSERT INTO jobs (title, location, description, requirements, is_active) VALUES
('Senior Market Analyst - GCC Markets', 'Dubai, UAE', 'Lead research and analysis of Gulf Cooperation Council financial markets, providing insights to institutional clients and internal teams.', 'MBA or equivalent, 7+ years in financial markets research, deep knowledge of GCC economies, excellent written and verbal communication skills in English and Arabic.', TRUE),
('Investment Associate - Infrastructure', 'Riyadh, Saudi Arabia', 'Support infrastructure investment deals across MENA region, conducting due diligence, financial modeling, and client presentations.', 'Bachelor''s in Finance or Engineering, 3-5 years investment banking or private equity experience, strong financial modeling skills, willingness to travel.', TRUE),
('Content Manager - Regional Insights', 'Cairo, Egypt', 'Manage content production for market insights, coordinate with analysts, and ensure high-quality publications meeting editorial standards.', 'Bachelor''s degree in journalism, economics, or related field, 5+ years content management experience, excellent writing skills, knowledge of MENA markets.', TRUE)
ON CONFLICT DO NOTHING;