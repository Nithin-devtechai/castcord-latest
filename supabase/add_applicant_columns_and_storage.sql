-- Run this in Supabase Dashboard → SQL Editor.
-- Adds new columns to casting_applications and storage policies for candidate photos.
--
-- STEP 1 (required): Create the storage bucket first.
--   - Go to Dashboard → Storage → "New bucket"
--   - Name: exactly "candidate-photos" (no spaces)
--   - Public bucket: ON (so applicants can see uploaded photos)
--   - File size limit: e.g. 5 MB, or leave default
--   - Allowed MIME types: leave empty, OR add: image/jpeg, image/png, image/gif, image/webp
--
-- STEP 2: Run this entire SQL script (adds columns + storage policies).

-- 1. Add new columns to casting_applications
ALTER TABLE public.casting_applications
  ADD COLUMN IF NOT EXISTS candidate_photo_url text,
  ADD COLUMN IF NOT EXISTS youtube_link text,
  ADD COLUMN IF NOT EXISTS portfolio_link text;

-- 2. Allow public upload and read for candidate-photos bucket (bucket must exist first)
DROP POLICY IF EXISTS "Allow public upload to candidate-photos" ON storage.objects;
CREATE POLICY "Allow public upload to candidate-photos"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'candidate-photos');

DROP POLICY IF EXISTS "Allow public read from candidate-photos" ON storage.objects;
CREATE POLICY "Allow public read from candidate-photos"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'candidate-photos');
