# Seed Dummy Data

This guide explains how to seed your database with 10 users and 50 recipes (5 recipes per user).

## ⚠️ Important: Foreign Key Constraint

The `profiles` table has a foreign key to `auth.users(id)`, so you **must have existing auth users** before creating profiles.

## ✅ Recommended: Auto Seed Script

**Use `seed-dummy-data-auto.sql`** - This is the easiest option!

This script automatically:
1. Finds your existing users from `auth.users`
2. Creates/updates profiles for them
3. Creates 5 recipes for each user

### Steps:

1. **Create at least 1 user** (you can create up to 10):
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User"
   - Create users with any email/password
   - The script will use the first 10 users it finds

2. **Run the auto seed script**:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the entire contents of `seed-dummy-data-auto.sql`
   - Click "Run"
   - The script will create profiles and recipes for however many users you have (up to 10)

3. **Verify**:
   - Check Table Editor → profiles (should have same number as your users)
   - Check Table Editor → recipes (should have 5 recipes per user)

## Alternative: Manual Seed Script

If you prefer more control, use `seed-dummy-data.sql`:

1. Create 10 users in Supabase Auth
2. Get their user IDs:
   ```sql
   SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 10;
   ```
3. Replace the placeholder UUIDs in `seed-dummy-data.sql` with actual user IDs
4. Run the script

## What You'll Get

**10 User Profiles:**
1. chef_mario - Italian chef
2. baking_bella - Pastry chef
3. spice_master - Indian cuisine expert
4. healthy_hannah - Nutrition-focused cook
5. grill_guru - BBQ expert
6. vegan_victoria - Plant-based cooking
7. asian_chef_li - Asian cuisine master
8. mediterranean_maria - Mediterranean specialist
9. comfort_cook - Comfort food lover
10. fresh_fiona - Farm-to-table enthusiast

**50 Recipes** covering:
- Italian, Dessert, Indian, Salad, Main Course, Breakfast, BBQ, Vegan, Asian, Mediterranean, Comfort Food, Soup, Appetizer, Side Dish

All recipes include:
- Realistic ingredients and instructions
- Cooking times and difficulty levels
- Categories
- Image URLs from Unsplash

## Recipe Categories Included

- Italian
- Dessert
- Indian
- Salad
- Main Course
- Breakfast
- BBQ
- Vegan
- Asian
- Mediterranean
- Comfort Food
- Soup
- Appetizer
- Side Dish

All recipes include:
- Realistic ingredients lists
- Step-by-step instructions
- Cooking times
- Difficulty levels (Easy, Medium, Hard)
- Image URLs from Unsplash

