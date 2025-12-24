# Database Setup Guide

This directory contains the database schema and migration files for the Recipe Sharing Platform.

## Setup Instructions

### 1. Run the Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the `schema.sql` file
4. Copy and paste the entire contents into the SQL Editor
5. Click **Run** to execute the schema

### 2. Verify Tables

After running the schema, verify that all tables were created:

- `profiles` - User profiles
- `recipes` - Recipe posts

## Database Structure

### Profiles Table
- `id` (UUID, Primary Key) - References `auth.users(id)`
- `username` (TEXT, Unique) - User's username
- `full_name` (TEXT, Nullable) - User's full name
- `created_at` (TIMESTAMPTZ) - Profile creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Note:** Profiles are automatically created when a user signs up via the `handle_new_user()` trigger function.

### Recipes Table
- `id` (UUID, Primary Key) - Recipe identifier
- `user_id` (UUID) - References `profiles(id)`
- `title` (TEXT) - Recipe title
- `ingredients` (TEXT) - Ingredients list (stored as text)
- `instructions` (TEXT) - Cooking instructions (stored as text)
- `cooking_time` (INTEGER, Nullable) - Cooking time in minutes
- `difficulty` (TEXT, Nullable) - Difficulty level: 'Easy', 'Medium', or 'Hard'
- `category` (TEXT, Nullable) - Recipe category
- `created_at` (TIMESTAMPTZ) - Recipe creation timestamp

## Indexes

The schema includes indexes for:
- Fast recipe lookups by user (`idx_recipes_user_id`)
- Efficient sorting by creation date (`idx_recipes_created_at`)
- Full-text search on recipe titles (`idx_recipes_title`)
- Filtering by category (`idx_recipes_category`)
- Filtering by difficulty (`idx_recipes_difficulty`)

## Security

All tables have Row Level Security (RLS) enabled with policies that:
- Allow public read access to profiles and recipes
- Restrict writes to authenticated users only
- Ensure users can only modify their own content

## Automatic Profile Creation

When a user signs up through Supabase Auth, a profile is automatically created via the `on_auth_user_created` trigger. The username is generated from the user's metadata or defaults to `user_` + first 8 characters of their UUID.
