-- Migration: Add last_signed_in column to profiles table
-- Run this in your Supabase SQL Editor

-- Add last_signed_in column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_signed_in TIMESTAMPTZ;

