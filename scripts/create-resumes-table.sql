-- Create resumes table for storing resume files and their analyses
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on filename for faster lookups
CREATE INDEX IF NOT EXISTS idx_resumes_filename ON resumes(filename);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this based on your needs)
CREATE POLICY "Allow all operations on resumes" ON resumes
  FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE resumes IS 'Stores resume files uploaded to Supabase storage with their AI analysis';
COMMENT ON COLUMN resumes.filename IS 'Original filename of the uploaded resume';
COMMENT ON COLUMN resumes.url IS 'Public URL to access the resume file';
COMMENT ON COLUMN resumes.analysis IS 'AI-generated analysis of the resume content (JSONB)';
COMMENT ON COLUMN resumes.metadata IS 'Additional metadata like content type, tags, file size, etc.'; 