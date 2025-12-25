-- Migration: Add email column to profiles table
-- Run this in your Supabase SQL Editor

-- Add email column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing profiles with email from auth.users
UPDATE profiles
SET email = (
  SELECT email
  FROM auth.users
  WHERE auth.users.id = profiles.id
)
WHERE email IS NULL;

-- Make email NOT NULL after populating existing data
-- (Optional: Uncomment if you want to enforce email as required)
ALTER TABLE profiles
ALTER COLUMN email SET NOT NULL;

