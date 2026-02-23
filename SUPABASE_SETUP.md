# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Copy your **Project URL** and **Anon Key** from the project settings

## 2. Create Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create performances table
CREATE TABLE performances (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  audio_path TEXT,
  duration INTEGER,
  performance_type TEXT,
  performance_type_other TEXT,
  directions JSONB,
  info JSONB,
  approved BOOLEAN DEFAULT FALSE,
  schedule_time TEXT,
  schedule_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket for audio files
-- (Do this from Storage tab: Create new bucket named "performance-audio")
```

To add the new columns to an existing table, run:
```sql
ALTER TABLE performances ADD COLUMN approved BOOLEAN DEFAULT FALSE;
ALTER TABLE performances ADD COLUMN schedule_time TEXT;
ALTER TABLE performances ADD COLUMN schedule_order INTEGER;
```

## 3. Create Storage Bucket

1. Go to the Storage tab in Supabase
2. Create a new bucket named `performance-audio`
3. Set it to Public or Private based on your needs

## 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Update with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anon key
   - `NEXT_PUBLIC_ADMIN_PASSWORD` - Your admin password

## 5. Row Level Security (Optional but Recommended)

For production, set up RLS policies in Supabase:

```sql
ALTER TABLE performances ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all performances
CREATE POLICY "Enable read access for all users" ON performances
  FOR SELECT USING (true);

-- Allow authenticated users to create performances
CREATE POLICY "Enable insert for authenticated users" ON performances
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own performances
CREATE POLICY "Enable update for performance owner" ON performances
  FOR UPDATE USING (true);
```

## Usage

The app stores:
- Performance metadata (name, type, leaders, members, notes)
- Audio files (in `performance-audio` bucket)
- Lighting cues (directions with floodlight and overhead settings)
- Approval status (approved performances show on /live)
- Schedule time and order (for scheduling performances)
- All in Supabase for cloud persistence
