-- FIX: Manually backfill profiles for all existing auth users who don't have one
-- Run this in Supabase SQL Editor → New Query → Run ▶

INSERT INTO public.profiles (id, email)
SELECT 
  au.id,
  au.email
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;
