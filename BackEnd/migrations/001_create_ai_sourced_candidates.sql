-- AI Sourced Candidates Table
CREATE TABLE IF NOT EXISTS ai_sourced_candidates (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  skills TEXT[],
  total_experience INTEGER DEFAULT 0,
  current_company VARCHAR(255),
  designation VARCHAR(255),
  location VARCHAR(255),
  education JSONB DEFAULT '[]',
  summary TEXT,
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  resume_url VARCHAR(500),
  ai_source_type VARCHAR(50) NOT NULL,
  ai_sourced_by VARCHAR(50),
  ai_sourced_at TIMESTAMP DEFAULT NOW(),
  recruiter_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_candidates_email ON ai_sourced_candidates(email);
CREATE INDEX IF NOT EXISTS idx_ai_candidates_phone ON ai_sourced_candidates(phone);
CREATE INDEX IF NOT EXISTS idx_ai_candidates_github ON ai_sourced_candidates(github_url);
CREATE INDEX IF NOT EXISTS idx_ai_candidates_linkedin ON ai_sourced_candidates(linkedin_url);
CREATE INDEX IF NOT EXISTS idx_ai_candidates_source_type ON ai_sourced_candidates(ai_source_type);
CREATE INDEX IF NOT EXISTS idx_ai_candidates_recruiter ON ai_sourced_candidates(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_ai_candidates_created ON ai_sourced_candidates(created_at DESC);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_ai_candidates_search ON ai_sourced_candidates USING gin(to_tsvector('english', 
  COALESCE(full_name, '') || ' ' || 
  COALESCE(designation, '') || ' ' || 
  COALESCE(current_company, '') || ' ' || 
  COALESCE(location, '')
));

-- Constraint: At least email OR phone must exist
ALTER TABLE ai_sourced_candidates 
ADD CONSTRAINT check_contact_info 
CHECK (email IS NOT NULL OR phone IS NOT NULL);

COMMENT ON TABLE ai_sourced_candidates IS 'Stores AI-sourced candidates from GitHub, LinkedIn, and other platforms';
COMMENT ON COLUMN ai_sourced_candidates.ai_source_type IS 'Source: GITHUB, LINKEDIN, NAUKRI, INDEED, MONSTER, API_IMPORT, CSV_IMPORT';
