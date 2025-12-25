-- Migration: Add bio column to profiles table
-- Run this in your Supabase SQL Editor

-- Add bio column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

