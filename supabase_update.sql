-- Run this in your Supabase SQL Editor to update the movies table 
-- with the new fields we need (is_hero, release_year).

ALTER TABLE public.movies 
ADD COLUMN IF NOT EXISTS is_hero boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS release_year text DEFAULT '';
