-- 1. Add avatar_url to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Create the storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage RLS Policies
-- Anyone can view public avatars
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- Users can upload their own avatar (filename must match their UID, or they must own the uploaded object)
CREATE POLICY "Users can upload their own avatar." 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar." 
ON storage.objects FOR UPDATE 
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar." 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid() = owner);
