-- Sample Music Projects Data for Ezra's Portfolio
-- Run this in your Supabase SQL Editor

-- First, make sure the music_projects table exists
CREATE TABLE IF NOT EXISTS music_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'video',
  role TEXT,
  composer TEXT,
  duration TEXT,
  date DATE,
  location TEXT,
  event TEXT,
  instruments TEXT[],
  genre TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample music projects
INSERT INTO music_projects (
  title,
  subtitle,
  description,
  media_url,
  media_type,
  role,
  composer,
  duration,
  date,
  location,
  event,
  instruments,
  genre,
  featured,
  sort_order
) VALUES 
(
  'Symphony No. V',
  'Movement IV • 5:33',
  'Conducting Beethoven\'s Fifth Symphony with the Atlanta University Center Symphony Orchestra',
  'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/AUCSO%20-%20CAU%20Board%20Meeting%20-Beethoven%205%20IV%20-%2002_21_20.MOV',
  'video',
  'conductor',
  'Ludwig van Beethoven',
  '5:33',
  '2020-06-15',
  'Atlanta, GA',
  'AUCSO - CAU Board Meeting',
  ARRAY['orchestra'],
  'Classical',
  true,
  1
),
(
  'Piano Sonata No. 14',
  'Moonlight Sonata • 15:20',
  'Complete performance of Beethoven\'s Moonlight Sonata',
  'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/Beethoven%20Moonlight%20Sonata%20-%20Complete%20Performance.MOV',
  'video',
  'pianist',
  'Ludwig van Beethoven',
  '15:20',
  '2021-03-10',
  'Atlanta, GA',
  'Solo Recital',
  ARRAY['piano'],
  'Classical',
  true,
  2
),
(
  'String Quartet Op. 18',
  'Allegro • 8:45',
  'Performance of Beethoven\'s String Quartet with chamber ensemble',
  'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/Beethoven%20String%20Quartet%20Op%2018%20No%201%20-%20Allegro.MOV',
  'video',
  'violist',
  'Ludwig van Beethoven',
  '8:45',
  '2020-12-05',
  'Atlanta, GA',
  'Chamber Music Ensemble',
  ARRAY['violin', 'viola', 'cello'],
  'Classical',
  true,
  3
),
(
  'Jazz Improvisation',
  'Blues in F • 4:12',
  'Original jazz composition with piano trio',
  'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/Jazz%20Improvisation%20-%20Blues%20in%20F.MOV',
  'video',
  'pianist',
  'Ezra Haugabrooks',
  '4:12',
  '2022-08-20',
  'Atlanta, GA',
  'Jazz Club Performance',
  ARRAY['piano', 'bass', 'drums'],
  'Jazz',
  false,
  4
),
(
  'Contemporary Composition',
  'Digital Dreams • 6:30',
  'Original contemporary piece blending classical and electronic elements',
  'https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/media/Contemporary%20Composition%20-%20Digital%20Dreams.MOV',
  'video',
  'composer',
  'Ezra Haugabrooks',
  '6:30',
  '2023-01-15',
  'Atlanta, GA',
  'Contemporary Music Festival',
  ARRAY['synthesizer', 'strings', 'percussion'],
  'Contemporary',
  false,
  5
);

-- Update the updated_at timestamp
UPDATE music_projects SET updated_at = NOW() WHERE updated_at IS NULL; 