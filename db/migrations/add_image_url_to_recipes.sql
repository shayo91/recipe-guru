-- Migration: Add image_url column to recipes table
-- Run this in your Supabase SQL Editor

-- Add image_url column to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS image_url TEXT;

