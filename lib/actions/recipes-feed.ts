"use server";

import { createClient } from "@/lib/supabase/server";
import { RecipeWithProfile } from "@/types/database";

interface FetchRecipesParams {
  category?: string | null;
  difficulty?: string | null;
  search?: string | null;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchRecipes({
  category,
  difficulty,
  search,
  sortBy = "newest",
  page = 0,
  pageSize = 12,
}: FetchRecipesParams) {
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select(
      `
      *,
      profiles!inner (
        id,
        username,
        email,
        full_name
      )
    `,
      { count: "exact" }
    );

  if (category) {
    query = query.ilike("category", `%${category}%`);
  }

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,ingredients.ilike.%${search}%,instructions.ilike.%${search}%`
    );
  }

  // Apply sorting
  if (sortBy === "most_liked") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "most_commented") {
    query = query.order("created_at", { ascending: false });
  } else {
    // newest (default)
    query = query.order("created_at", { ascending: false });
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data: recipes, error, count } = await query.range(from, to);

  if (error) {
    return { error: error.message, recipes: [], hasMore: false };
  }

  if (!recipes || recipes.length === 0) {
    return { recipes: [], hasMore: false };
  }

  // Get like and comment counts for each recipe
  const recipeIds = recipes.map((r) => r.id);

  // Get like counts
  const { data: likesData } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  const likeCounts =
    likesData?.reduce((acc, like) => {
      acc[like.recipe_id] = (acc[like.recipe_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  // Get comment counts
  const { data: commentsData } = await supabase
    .from("recipe_comments")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  const commentCounts =
    commentsData?.reduce((acc, comment) => {
      acc[comment.recipe_id] = (acc[comment.recipe_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  let recipesWithProfile: RecipeWithProfile[] = recipes.map((recipe) => ({
    ...recipe,
    profile: Array.isArray(recipe.profiles)
      ? recipe.profiles[0]
      : recipe.profiles,
    like_count: likeCounts[recipe.id] || 0,
    comment_count: commentCounts[recipe.id] || 0,
  }));

  // Apply sorting after getting counts
  if (sortBy === "most_liked") {
    recipesWithProfile = recipesWithProfile.sort(
      (a, b) => (b.like_count || 0) - (a.like_count || 0)
    );
  } else if (sortBy === "most_commented") {
    recipesWithProfile = recipesWithProfile.sort(
      (a, b) => (b.comment_count || 0) - (a.comment_count || 0)
    );
  }

  const hasMore = count ? from + recipes.length < count : false;

  return {
    recipes: recipesWithProfile,
    hasMore,
  };
}

