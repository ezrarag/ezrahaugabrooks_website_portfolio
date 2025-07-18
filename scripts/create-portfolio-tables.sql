
-- Create table for developer projects
CREATE TABLE IF NOT EXISTS developer_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[], -- Array of technology names
  status TEXT DEFAULT 'completed', -- completed, in_progress, planned
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for linguist projects
CREATE TABLE IF NOT EXISTS linguist_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  languages TEXT[], -- Array of languages involved
  project_type TEXT, -- translation, research, analysis, etc.
  status TEXT DEFAULT 'completed',
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for music projects (enhance existing structure)
CREATE TABLE IF NOT EXISTS music_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'video', -- video, audio, interactive
  role TEXT, -- composer, performer, conductor, pianist
  composer TEXT,
  duration TEXT,
  date DATE,
  location TEXT,
  event TEXT,
  instruments TEXT[], -- Array of instruments
  genre TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for educator projects
CREATE TABLE IF NOT EXISTS educator_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  course_url TEXT,
  institution TEXT,
  student_count INTEGER,
  rating DECIMAL(2,1), -- e.g., 4.8
  duration TEXT, -- e.g., "12 weeks", "Ongoing"
  level TEXT, -- beginner, intermediate, advanced
  topics TEXT[], -- Array of topics covered
  status TEXT DEFAULT 'active', -- active, completed, upcoming
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_developer_projects_featured ON developer_projects(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_linguist_projects_featured ON linguist_projects(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_music_projects_featured ON music_projects(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_educator_projects_featured ON educator_projects(featured, sort_order);

-- Insert sample data for developer projects
INSERT INTO developer_projects (title, subtitle, description, technologies, featured, sort_order) VALUES
('E-commerce Platform', 'Next.js • TypeScript • Stripe', 'Full-stack e-commerce solution with payment processing', ARRAY['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'], true, 1),
('Real-time Dashboard', 'React • WebSocket • D3.js', 'Interactive analytics dashboard with real-time data visualization', ARRAY['React', 'WebSocket', 'D3.js', 'Node.js'], true, 2),
('Mobile Banking App', 'React Native • Firebase', 'Cross-platform mobile banking application', ARRAY['React Native', 'Firebase', 'Redux'], true, 3),
('API Gateway Service', 'Node.js • Docker • Redis', 'Microservices API gateway with caching and rate limiting', ARRAY['Node.js', 'Docker', 'Redis', 'Express'], true, 4);

-- Insert sample data for linguist projects
INSERT INTO linguist_projects (title, subtitle, description, languages, project_type, featured, sort_order) VALUES
('Crypto Translation Protocol', 'Blockchain • Web3 • IPFS', 'Decentralized translation protocol for Web3 applications', ARRAY['English', 'Spanish', 'Mandarin'], 'protocol', true, 1),
('Philosophy Papers', 'Semantic Theory • Research', 'Academic research on semantic theory and language philosophy', ARRAY['English', 'German', 'French'], 'research', true, 2),
('Language Learning Game', 'Unity • AI/ML • NLP', 'Interactive language learning platform with AI tutoring', ARRAY['English', 'Spanish', 'Japanese'], 'application', true, 3),
('Multilingual Interface', 'React • i18n • Accessibility', 'Accessible multilingual web interface design', ARRAY['English', 'Spanish', 'Arabic'], 'interface', true, 4);

-- Insert sample data for music projects
INSERT INTO music_projects (title, subtitle, media_url, role, composer, date, location, event, featured, sort_order) VALUES
('Symphony No. V', 'Movement IV • 5:33', 'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/AUCSO%20-%20CAU%20Board%20Meeting%20-Beethoven%205%20IV%20-%2002_21_20.MOV', 'conductor', 'Ludwig van Beethoven', '2020-06-15', 'Atlanta, GA', 'AUCSO - CAU Board Meeting', true, 1),
('Piano Sonata Op. 2 No. 1', 'Adagio • 4:02', 'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media//pov_cam_beethoven.mp4', 'pianist', 'Ludwig van Beethoven', '2020-01-01', NULL, NULL, true, 2),
('Black Men Stories', 'Take 1 • 8:52', 'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media//plgdc%20-%202019%20-%20first%20video.MOV', 'composer', 'Ezra Haugabrooks', '2019-06-15', 'Miami, FL', 'Peter London Global Dance Company Performances', true, 3);

-- Insert sample data for educator projects
INSERT INTO educator_projects (title, subtitle, description, institution, student_count, rating, topics, featured, sort_order) VALUES
('Advanced Web Development', '1,250 students • 4.8★', 'Comprehensive web development course covering modern frameworks and best practices', 'Online Platform', 1250, 4.8, ARRAY['React', 'Node.js', 'Database Design', 'Deployment'], true, 1),
('Computational Linguistics', 'University Extension • NLP', 'Graduate-level course on natural language processing and computational methods', 'University Extension', 45, 4.9, ARRAY['NLP', 'Machine Learning', 'Syntax Analysis', 'Semantics'], true, 2),
('Music Technology Workshop', 'Creative Institute • DAW', 'Hands-on workshop covering digital audio workstations and music production', 'Creative Institute', 120, 4.7, ARRAY['DAW', 'Audio Engineering', 'MIDI', 'Sound Design'], true, 3),
('BEAM Think Tank', 'Research • Collaboration', 'Collaborative research initiative combining technology and creative arts', 'Independent', 25, 5.0, ARRAY['Research Methods', 'Creative Technology', 'Collaboration'], true, 4);
