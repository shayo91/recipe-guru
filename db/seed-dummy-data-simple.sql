-- Simplified Seed: Just Recipes (Assumes you already have users)
-- This version only creates recipes and assigns them to existing users
-- Run this AFTER you have at least 10 users in your auth.users table

-- Get the first 10 user IDs and create recipes for them
DO $$
DECLARE
  user_ids UUID[];
  i INTEGER;
BEGIN
  -- Get first 10 user IDs from auth.users
  SELECT ARRAY_AGG(id) INTO user_ids
  FROM (
    SELECT id FROM auth.users ORDER BY created_at LIMIT 10
  ) users;
  
  -- If we don't have 10 users, this will fail gracefully
  IF array_length(user_ids, 1) < 10 THEN
    RAISE NOTICE 'You need at least 10 users. Currently have % users.', array_length(user_ids, 1);
    RETURN;
  END IF;
  
  -- Create 5 recipes for each user
  FOR i IN 1..10 LOOP
    -- Recipes for user i
    -- Recipe 1
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES (
      user_ids[i],
      CASE i
        WHEN 1 THEN 'Classic Margherita Pizza'
        WHEN 2 THEN 'Chocolate Chip Cookies'
        WHEN 3 THEN 'Chicken Tikka Masala'
        WHEN 4 THEN 'Quinoa Salad Bowl'
        WHEN 5 THEN 'Classic BBQ Ribs'
        WHEN 6 THEN 'Vegan Buddha Bowl'
        WHEN 7 THEN 'Beef Stir Fry'
        WHEN 8 THEN 'Greek Salad'
        WHEN 9 THEN 'Mac and Cheese'
        WHEN 10 THEN 'Farm Fresh Caprese Salad'
      END,
      'See full recipe for ingredients',
      'See full recipe for instructions',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      CASE i WHEN 1 THEN 30 WHEN 2 THEN 30 WHEN 3 THEN 60 WHEN 4 THEN 25 WHEN 5 THEN 360 WHEN 6 THEN 40 WHEN 7 THEN 20 WHEN 8 THEN 15 WHEN 9 THEN 40 WHEN 10 THEN 10 END,
      CASE i WHEN 1 THEN 'Easy' WHEN 2 THEN 'Easy' WHEN 3 THEN 'Medium' WHEN 4 THEN 'Easy' WHEN 5 THEN 'Hard' WHEN 6 THEN 'Easy' WHEN 7 THEN 'Easy' WHEN 8 THEN 'Easy' WHEN 9 THEN 'Easy' WHEN 10 THEN 'Easy' END,
      CASE i WHEN 1 THEN 'Italian' WHEN 2 THEN 'Dessert' WHEN 3 THEN 'Indian' WHEN 4 THEN 'Salad' WHEN 5 THEN 'BBQ' WHEN 6 THEN 'Vegan' WHEN 7 THEN 'Asian' WHEN 8 THEN 'Salad' WHEN 9 THEN 'Comfort Food' WHEN 10 THEN 'Salad' END,
      NOW()
    );
    
    -- Recipe 2-5 for each user (simplified - you can expand these)
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES 
      (user_ids[i], 'Recipe ' || (i*5-3) || ' Title', 'Ingredients list', 'Step by step instructions', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800', 30, 'Easy', 'Main Course', NOW()),
      (user_ids[i], 'Recipe ' || (i*5-2) || ' Title', 'Ingredients list', 'Step by step instructions', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 45, 'Medium', 'Main Course', NOW()),
      (user_ids[i], 'Recipe ' || (i*5-1) || ' Title', 'Ingredients list', 'Step by step instructions', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 25, 'Easy', 'Main Course', NOW()),
      (user_ids[i], 'Recipe ' || (i*5) || ' Title', 'Ingredients list', 'Step by step instructions', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', 60, 'Medium', 'Main Course', NOW());
  END LOOP;
END $$;

-- Note: This is a simplified version. For full recipes with detailed ingredients and instructions,
-- use the main seed-dummy-data.sql file and replace the UUIDs with actual user IDs.

