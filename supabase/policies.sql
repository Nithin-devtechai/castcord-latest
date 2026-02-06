-- Run this in Supabase Dashboard → SQL Editor if applications (or events) don't show.
-- Row Level Security (RLS) blocks reads by default; these policies allow the app to work.
-- You can run this whole script; it drops existing policies first so it's safe to re-run.

-- casting_events
DROP POLICY IF EXISTS "Allow public read on casting_events" ON public.casting_events;
CREATE POLICY "Allow public read on casting_events"
  ON public.casting_events FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public insert on casting_events" ON public.casting_events;
CREATE POLICY "Allow public insert on casting_events"
  ON public.casting_events FOR INSERT TO anon WITH CHECK (true);

-- casting_applications (this is usually why "Applications" is empty)
DROP POLICY IF EXISTS "Allow public read on casting_applications" ON public.casting_applications;
CREATE POLICY "Allow public read on casting_applications"
  ON public.casting_applications FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public insert on casting_applications" ON public.casting_applications;
CREATE POLICY "Allow public insert on casting_applications"
  ON public.casting_applications FOR INSERT TO anon WITH CHECK (true);
