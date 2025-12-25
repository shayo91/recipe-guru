-- Auto Seed Script: Creates profiles and recipes for existing auth users
-- This script will use the first 10 users from auth.users
-- If you have fewer than 10 users, it will use however many you have

DO $$
DECLARE
  user_record RECORD;
  user_count INTEGER := 0;
  user_ids UUID[] := ARRAY[]::UUID[];
  usernames TEXT[] := ARRAY['chef_mario', 'baking_bella', 'spice_master', 'healthy_hannah', 'grill_guru', 'vegan_victoria', 'asian_chef_li', 'mediterranean_maria', 'comfort_cook', 'fresh_fiona'];
  full_names TEXT[] := ARRAY['Mario Rossi', 'Bella Smith', 'Raj Patel', 'Hannah Jones', 'Mike Wilson', 'Victoria Brown', 'Li Zhang', 'Maria Garcia', 'John Doe', 'Fiona Taylor'];
  emails TEXT[] := ARRAY['mario.rossi@example.com', 'bella.smith@example.com', 'raj.patel@example.com', 'hannah.jones@example.com', 'mike.wilson@example.com', 'victoria.brown@example.com', 'li.zhang@example.com', 'maria.garcia@example.com', 'john.doe@example.com', 'fiona.taylor@example.com'];
  bios TEXT[] := ARRAY[
    'Italian chef passionate about traditional recipes',
    'Pastry chef and dessert enthusiast',
    'Love cooking with spices and bold flavors',
    'Nutrition-focused home cook',
    'BBQ and grilling expert',
    'Plant-based cooking advocate',
    'Master of Asian cuisine',
    'Mediterranean cooking specialist',
    'Comfort food is my specialty',
    'Farm-to-table cooking enthusiast'
  ];
  i INTEGER;
BEGIN
  -- Get existing users from auth.users
  FOR user_record IN 
    SELECT id, email FROM auth.users ORDER BY created_at LIMIT 10
  LOOP
    user_ids := array_append(user_ids, user_record.id);
    user_count := user_count + 1;
  END LOOP;
  
  IF user_count = 0 THEN
    RAISE EXCEPTION 'No users found in auth.users. Please create at least one user first through Supabase Auth.';
  END IF;
  
  RAISE NOTICE 'Found % users. Creating profiles and recipes...', user_count;
  
  -- Create or update profiles for each user
  FOR i IN 1..user_count LOOP
    INSERT INTO profiles (id, username, email, full_name, bio, created_at, updated_at)
    VALUES (
      user_ids[i],
      usernames[i],
      emails[i],
      full_names[i],
      bios[i],
      NOW(),
      NOW()
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      bio = EXCLUDED.bio,
      updated_at = NOW();
  END LOOP;
  
  RAISE NOTICE 'Profiles created/updated. Now creating recipes...';
  
  -- Now create recipes for each user
  -- User 1: chef_mario (Italian)
  IF user_count >= 1 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[1], 'Classic Margherita Pizza', 'Pizza dough, 200g mozzarella, 100g tomato sauce, fresh basil, olive oil, salt', '1. Preheat oven to 250°C\n2. Roll out pizza dough\n3. Spread tomato sauce\n4. Add mozzarella\n5. Bake for 10-12 minutes\n6. Top with fresh basil and drizzle olive oil', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800', 30, 'Easy', 'Italian', NOW()),
      (user_ids[1], 'Creamy Carbonara', '400g spaghetti, 200g pancetta, 4 eggs, 100g parmesan, black pepper, salt', '1. Cook pasta al dente\n2. Fry pancetta until crispy\n3. Mix eggs and parmesan\n4. Combine hot pasta with pancetta\n5. Add egg mixture off heat\n6. Season with black pepper', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800', 25, 'Medium', 'Italian', NOW()),
      (user_ids[1], 'Tiramisu', '500g mascarpone, 4 eggs, 100g sugar, 200ml coffee, ladyfingers, cocoa powder', '1. Separate eggs\n2. Beat yolks with sugar\n3. Mix in mascarpone\n4. Whip whites and fold in\n5. Dip ladyfingers in coffee\n6. Layer in dish\n7. Dust with cocoa', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800', 60, 'Medium', 'Dessert', NOW()),
      (user_ids[1], 'Risotto ai Funghi', '300g arborio rice, 200g mushrooms, 1 onion, 1L vegetable stock, white wine, parmesan, butter', '1. Sauté onion\n2. Add rice and toast\n3. Add wine\n4. Gradually add hot stock\n5. Stir constantly\n6. Add mushrooms\n7. Finish with butter and parmesan', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800', 45, 'Hard', 'Italian', NOW()),
      (user_ids[1], 'Bruschetta al Pomodoro', 'Baguette, 4 tomatoes, garlic, basil, olive oil, balsamic vinegar, salt', '1. Toast bread slices\n2. Dice tomatoes\n3. Mix with garlic and basil\n4. Drizzle with olive oil and vinegar\n5. Top bread with mixture', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800', 15, 'Easy', 'Appetizer', NOW());
  END IF;
  
  -- User 2: baking_bella (Desserts)
  IF user_count >= 2 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[2], 'Chocolate Chip Cookies', '225g butter, 150g brown sugar, 100g white sugar, 2 eggs, 300g flour, 200g chocolate chips, vanilla extract', '1. Cream butter and sugars\n2. Add eggs and vanilla\n3. Mix in flour\n4. Fold in chocolate chips\n5. Drop spoonfuls on baking sheet\n6. Bake at 180°C for 12 minutes', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800', 30, 'Easy', 'Dessert', NOW()),
      (user_ids[2], 'Red Velvet Cake', '300g flour, 200g sugar, 2 eggs, 250ml buttermilk, red food coloring, cocoa powder, cream cheese frosting', '1. Mix dry ingredients\n2. Cream butter and sugar\n3. Add eggs and coloring\n4. Alternate flour and buttermilk\n5. Bake at 175°C for 30 minutes\n6. Frost with cream cheese', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800', 90, 'Hard', 'Dessert', NOW()),
      (user_ids[2], 'Lemon Meringue Pie', 'Pastry crust, 4 lemons, 200g sugar, 4 eggs, 50g cornstarch, butter', '1. Bake pastry shell\n2. Make lemon curd\n3. Fill shell with curd\n4. Top with meringue\n5. Brown meringue in oven', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800', 75, 'Hard', 'Dessert', NOW()),
      (user_ids[2], 'Banana Bread', '3 ripe bananas, 150g flour, 100g sugar, 1 egg, 50g butter, baking soda, vanilla', '1. Mash bananas\n2. Mix wet ingredients\n3. Combine with dry ingredients\n4. Pour into loaf pan\n5. Bake at 175°C for 60 minutes', 'https://images.unsplash.com/photo-1606312619070-d48b4cbc6b3c?w=800', 70, 'Easy', 'Dessert', NOW()),
      (user_ids[2], 'Cinnamon Rolls', '500g flour, 250ml milk, 50g butter, 1 egg, yeast, brown sugar, cinnamon, cream cheese frosting', '1. Make dough and let rise\n2. Roll out dough\n3. Spread butter, sugar, and cinnamon\n4. Roll up and slice\n5. Bake at 180°C for 25 minutes\n6. Frost while warm', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800', 120, 'Medium', 'Dessert', NOW());
  END IF;
  
  -- User 3: spice_master (Indian)
  IF user_count >= 3 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[3], 'Chicken Tikka Masala', '500g chicken, 400ml coconut milk, 2 onions, garlic, ginger, garam masala, turmeric, tomatoes, cream', '1. Marinate chicken in spices\n2. Grill chicken pieces\n3. Make masala sauce\n4. Add chicken to sauce\n5. Simmer and finish with cream', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', 60, 'Medium', 'Indian', NOW()),
      (user_ids[3], 'Vegetable Biryani', '300g basmati rice, mixed vegetables, onions, biryani masala, yogurt, saffron, ghee', '1. Soak rice\n2. Parboil rice\n3. Layer rice and vegetables\n4. Add saffron and ghee\n5. Dum cook for 30 minutes', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800', 90, 'Hard', 'Indian', NOW()),
      (user_ids[3], 'Palak Paneer', '500g spinach, 300g paneer, onions, tomatoes, garam masala, cumin, cream', '1. Blanch and puree spinach\n2. Make onion-tomato base\n3. Add spinach puree\n4. Add paneer cubes\n5. Finish with cream and spices', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 40, 'Medium', 'Indian', NOW()),
      (user_ids[3], 'Butter Chicken', '500g chicken, butter, tomatoes, cream, garam masala, fenugreek, cashews', '1. Marinate chicken\n2. Cook chicken\n3. Make tomato-based sauce\n4. Add butter and cream\n5. Simmer with chicken', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', 50, 'Medium', 'Indian', NOW()),
      (user_ids[3], 'Samosas', 'Flour, potatoes, peas, spices, oil for frying', '1. Make dough\n2. Boil and mash potatoes\n3. Add spices and peas\n4. Fill and fold samosas\n5. Deep fry until golden', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', 45, 'Medium', 'Appetizer', NOW());
  END IF;
  
  -- User 4: healthy_hannah (Healthy)
  IF user_count >= 4 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[4], 'Quinoa Salad Bowl', '200g quinoa, mixed greens, cherry tomatoes, cucumber, avocado, feta, olive oil, lemon', '1. Cook quinoa\n2. Chop vegetables\n3. Mix quinoa with greens\n4. Add vegetables and feta\n5. Dress with olive oil and lemon', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 25, 'Easy', 'Salad', NOW()),
      (user_ids[4], 'Grilled Salmon with Vegetables', '4 salmon fillets, asparagus, bell peppers, olive oil, lemon, herbs, salt, pepper', '1. Season salmon\n2. Prepare vegetables\n3. Grill salmon 6 minutes per side\n4. Grill vegetables\n5. Serve with lemon', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800', 30, 'Easy', 'Main Course', NOW()),
      (user_ids[4], 'Green Smoothie Bowl', '2 bananas, 200g spinach, 100g mango, coconut milk, granola, berries, chia seeds', '1. Blend frozen fruits and spinach\n2. Add coconut milk\n3. Pour into bowl\n4. Top with granola and berries\n5. Sprinkle chia seeds', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 10, 'Easy', 'Breakfast', NOW()),
      (user_ids[4], 'Chicken and Vegetable Stir Fry', '400g chicken, mixed vegetables, soy sauce, ginger, garlic, sesame oil, rice', '1. Cut chicken into strips\n2. Heat wok\n3. Stir fry chicken\n4. Add vegetables\n5. Season with soy sauce\n6. Serve over rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', 25, 'Easy', 'Main Course', NOW()),
      (user_ids[4], 'Overnight Oats', '100g oats, 200ml almond milk, 1 banana, berries, honey, chia seeds', '1. Mix oats and milk\n2. Add mashed banana\n3. Sweeten with honey\n4. Refrigerate overnight\n5. Top with berries and seeds', 'https://images.unsplash.com/photo-1575925512655-788f37c6d01b?w=800', 5, 'Easy', 'Breakfast', NOW());
  END IF;
  
  -- User 5: grill_guru (BBQ)
  IF user_count >= 5 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[5], 'Classic BBQ Ribs', '2 racks pork ribs, BBQ sauce, brown sugar, paprika, garlic powder, salt, pepper', '1. Season ribs with dry rub\n2. Smoke at 110°C for 3 hours\n3. Wrap in foil for 2 hours\n4. Unwrap and sauce\n5. Grill until caramelized', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 360, 'Hard', 'BBQ', NOW()),
      (user_ids[5], 'Grilled Steak', '4 ribeye steaks, salt, pepper, garlic, butter, rosemary', '1. Season steaks generously\n2. Heat grill to high\n3. Grill 4-5 minutes per side\n4. Rest for 5 minutes\n5. Top with herb butter', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', 20, 'Medium', 'BBQ', NOW()),
      (user_ids[5], 'BBQ Chicken Wings', '2kg chicken wings, BBQ sauce, hot sauce, butter, garlic powder', '1. Season wings\n2. Bake at 200°C for 45 minutes\n3. Toss in BBQ sauce\n4. Grill for 5 minutes\n5. Serve with extra sauce', 'https://images.unsplash.com/photo-1527477396000-e27137b2a20b?w=800', 60, 'Easy', 'BBQ', NOW()),
      (user_ids[5], 'Grilled Corn on the Cob', '6 ears corn, butter, salt, pepper, lime, chili powder', '1. Soak corn in water\n2. Grill for 15 minutes\n3. Rotate frequently\n4. Brush with butter\n5. Season and serve', 'https://images.unsplash.com/photo-1527477396000-e27137b2a20b?w=800', 20, 'Easy', 'Side Dish', NOW()),
      (user_ids[5], 'Smoked Pulled Pork', '5kg pork shoulder, dry rub, BBQ sauce, buns, coleslaw', '1. Apply dry rub\n2. Smoke at 110°C for 8 hours\n3. Wrap and continue 4 hours\n4. Rest and pull\n5. Serve with sauce and slaw', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 720, 'Hard', 'BBQ', NOW());
  END IF;
  
  -- User 6: vegan_victoria (Vegan)
  IF user_count >= 6 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[6], 'Vegan Buddha Bowl', 'Quinoa, chickpeas, sweet potato, kale, avocado, tahini dressing', '1. Cook quinoa\n2. Roast sweet potato\n3. Roast chickpeas\n4. Massage kale\n5. Arrange in bowl\n6. Drizzle tahini dressing', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 40, 'Easy', 'Vegan', NOW()),
      (user_ids[6], 'Vegan Pad Thai', 'Rice noodles, tofu, bean sprouts, peanuts, lime, tamarind, soy sauce', '1. Soak noodles\n2. Press and fry tofu\n3. Make pad thai sauce\n4. Stir fry noodles\n5. Add tofu and vegetables\n6. Garnish with peanuts', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800', 30, 'Medium', 'Vegan', NOW()),
      (user_ids[6], 'Chickpea Curry', '2 cans chickpeas, coconut milk, onions, tomatoes, curry spices, rice', '1. Sauté onions\n2. Add spices\n3. Add tomatoes and chickpeas\n4. Pour coconut milk\n5. Simmer 20 minutes\n6. Serve over rice', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', 35, 'Easy', 'Vegan', NOW()),
      (user_ids[6], 'Vegan Chocolate Cake', 'Flour, sugar, cocoa, baking soda, vinegar, oil, vanilla, plant milk', '1. Mix dry ingredients\n2. Mix wet ingredients\n3. Combine\n4. Bake at 180°C for 30 minutes\n5. Cool and frost', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800', 50, 'Medium', 'Dessert', NOW()),
      (user_ids[6], 'Avocado Toast', 'Sourdough bread, 2 avocados, lemon, salt, pepper, red pepper flakes, cherry tomatoes', '1. Toast bread\n2. Mash avocado\n3. Season with lemon and salt\n4. Spread on toast\n5. Top with tomatoes and pepper flakes', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800', 10, 'Easy', 'Breakfast', NOW());
  END IF;
  
  -- User 7: asian_chef_li (Asian)
  IF user_count >= 7 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[7], 'Beef Stir Fry', '400g beef, bell peppers, broccoli, soy sauce, ginger, garlic, sesame oil', '1. Slice beef thinly\n2. Marinate in soy sauce\n3. Heat wok\n4. Stir fry beef\n5. Add vegetables\n6. Season and serve', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', 20, 'Easy', 'Asian', NOW()),
      (user_ids[7], 'Pork Dumplings', 'Dumpling wrappers, ground pork, cabbage, ginger, soy sauce, sesame oil', '1. Mix filling\n2. Fill wrappers\n3. Fold and seal\n4. Steam for 10 minutes\n5. Pan fry for crispy bottom', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', 60, 'Medium', 'Asian', NOW()),
      (user_ids[7], 'Ramen Noodles', 'Ramen noodles, pork belly, soft boiled egg, nori, green onions, miso broth', '1. Cook noodles\n2. Prepare broth\n3. Soft boil egg\n4. Slice pork belly\n5. Assemble bowl\n6. Garnish', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', 30, 'Medium', 'Asian', NOW()),
      (user_ids[7], 'Kung Pao Chicken', '500g chicken, peanuts, bell peppers, dried chilies, soy sauce, rice wine', '1. Cube chicken\n2. Marinate\n3. Deep fry chicken\n4. Stir fry vegetables\n5. Combine with sauce\n6. Add peanuts', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', 25, 'Medium', 'Asian', NOW()),
      (user_ids[7], 'Sushi Rolls', 'Sushi rice, nori, salmon, cucumber, avocado, wasabi, soy sauce', '1. Cook and season rice\n2. Prepare fillings\n3. Lay nori on mat\n4. Spread rice\n5. Add fillings\n6. Roll and slice', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', 90, 'Hard', 'Asian', NOW());
  END IF;
  
  -- User 8: mediterranean_maria (Mediterranean)
  IF user_count >= 8 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[8], 'Greek Salad', 'Cucumber, tomatoes, red onion, feta, olives, olive oil, oregano, lemon', '1. Dice vegetables\n2. Crumble feta\n3. Mix all ingredients\n4. Dress with olive oil and lemon\n5. Season with oregano', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', 15, 'Easy', 'Salad', NOW()),
      (user_ids[8], 'Moussaka', 'Eggplant, ground lamb, tomatoes, onions, béchamel sauce, cheese', '1. Slice and fry eggplant\n2. Cook meat sauce\n3. Layer in dish\n4. Top with béchamel\n5. Bake at 180°C for 45 minutes', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800', 90, 'Hard', 'Mediterranean', NOW()),
      (user_ids[8], 'Hummus', 'Chickpeas, tahini, lemon, garlic, olive oil, cumin, salt', '1. Drain chickpeas\n2. Blend with tahini\n3. Add lemon and garlic\n4. Season with cumin and salt\n5. Drizzle with olive oil', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', 15, 'Easy', 'Appetizer', NOW()),
      (user_ids[8], 'Spanakopita', 'Phyllo dough, spinach, feta, onions, dill, eggs, butter', '1. Sauté spinach and onions\n2. Mix with feta and dill\n3. Layer phyllo with butter\n4. Add filling\n5. Bake at 180°C for 45 minutes', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800', 75, 'Medium', 'Mediterranean', NOW()),
      (user_ids[8], 'Grilled Halloumi', 'Halloumi cheese, olive oil, lemon, herbs, pita bread', '1. Slice halloumi\n2. Brush with oil\n3. Grill 2 minutes per side\n4. Serve with lemon and herbs\n5. Accompany with pita', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', 10, 'Easy', 'Mediterranean', NOW());
  END IF;
  
  -- User 9: comfort_cook (Comfort Food)
  IF user_count >= 9 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[9], 'Mac and Cheese', '500g macaroni, 300g cheddar, 200ml milk, butter, flour, breadcrumbs', '1. Cook pasta\n2. Make roux\n3. Add milk for béchamel\n4. Add cheese\n5. Mix with pasta\n6. Top with breadcrumbs and bake', 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba845?w=800', 40, 'Easy', 'Comfort Food', NOW()),
      (user_ids[9], 'Chicken Pot Pie', 'Chicken, vegetables, pie crust, cream, butter, flour, herbs', '1. Cook chicken and vegetables\n2. Make creamy sauce\n3. Fill pie dish\n4. Cover with crust\n5. Bake at 200°C for 35 minutes', 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba845?w=800', 75, 'Medium', 'Comfort Food', NOW()),
      (user_ids[9], 'Beef Stew', '1kg beef, carrots, potatoes, onions, beef stock, red wine, herbs', '1. Brown beef\n2. Add vegetables\n3. Pour stock and wine\n4. Simmer 2 hours\n5. Season and serve', 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba845?w=800', 150, 'Easy', 'Comfort Food', NOW()),
      (user_ids[9], 'Meatloaf', '500g ground beef, breadcrumbs, egg, onions, ketchup, Worcestershire sauce', '1. Mix all ingredients\n2. Form into loaf\n3. Top with ketchup\n4. Bake at 180°C for 60 minutes\n5. Rest before slicing', 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba845?w=800', 75, 'Easy', 'Comfort Food', NOW()),
      (user_ids[9], 'Chocolate Brownies', '200g chocolate, 150g butter, 200g sugar, 3 eggs, 100g flour, cocoa powder', '1. Melt chocolate and butter\n2. Mix in sugar\n3. Add eggs\n4. Fold in flour\n5. Bake at 180°C for 25 minutes', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800', 40, 'Easy', 'Dessert', NOW());
  END IF;
  
  -- User 10: fresh_fiona (Farm to Table)
  IF user_count >= 10 THEN
    INSERT INTO recipes (user_id, title, ingredients, instructions, image_url, cooking_time, difficulty, category, created_at)
    VALUES
      (user_ids[10], 'Farm Fresh Caprese Salad', 'Fresh tomatoes, mozzarella, basil, olive oil, balsamic, salt, pepper', '1. Slice tomatoes and mozzarella\n2. Arrange on plate\n3. Add basil leaves\n4. Drizzle with oil and balsamic\n5. Season', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', 10, 'Easy', 'Salad', NOW()),
      (user_ids[10], 'Roasted Vegetable Medley', 'Zucchini, bell peppers, eggplant, cherry tomatoes, olive oil, herbs', '1. Cut vegetables\n2. Toss with oil and herbs\n3. Roast at 200°C for 30 minutes\n4. Serve warm', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 40, 'Easy', 'Side Dish', NOW()),
      (user_ids[10], 'Fresh Pasta with Pesto', 'Fresh pasta, basil, pine nuts, parmesan, garlic, olive oil', '1. Make pesto in food processor\n2. Cook fresh pasta\n3. Toss pasta with pesto\n4. Add parmesan\n5. Serve immediately', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800', 20, 'Easy', 'Italian', NOW()),
      (user_ids[10], 'Garden Fresh Gazpacho', 'Tomatoes, cucumber, bell pepper, onion, garlic, olive oil, vinegar', '1. Roughly chop vegetables\n2. Blend until smooth\n3. Season with oil and vinegar\n4. Chill for 2 hours\n5. Serve cold', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', 15, 'Easy', 'Soup', NOW()),
      (user_ids[10], 'Herb Crusted Salmon', 'Salmon fillets, fresh herbs, breadcrumbs, lemon, olive oil', '1. Mix herbs and breadcrumbs\n2. Press onto salmon\n3. Pan sear skin side\n4. Finish in oven\n5. Serve with lemon', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800', 25, 'Easy', 'Main Course', NOW());
  END IF;
  
  RAISE NOTICE 'Successfully created profiles and recipes for % users!', user_count;
END $$;

