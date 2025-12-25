import { createClient } from "@/lib/supabase/server";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeWithProfile } from "@/types/database";

interface RecipeFeedProps {
  category?: string | null;
  difficulty?: string | null;
  search?: string | null;
  sortBy?: string | null;
}

export async function RecipeFeed({
  category,
  difficulty,
  search,
  sortBy = "newest",
}: RecipeFeedProps) {
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
    `
    );

  if (category) {
    query = query.ilike("category", `%${category}%`);
  }

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,ingredients.ilike.%${search}%,instructions.ilike.%${search}%`);
  }

  // Apply sorting
  if (sortBy === "most_liked") {
    // We'll need to join with likes count - for now, order by created_at and we'll add counts separately
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "most_commented") {
    query = query.order("created_at", { ascending: false });
  } else {
    // newest (default)
    query = query.order("created_at", { ascending: false });
  }

  const { data: recipes, error } = await query.limit(50);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-800">Error loading recipes: {error.message}</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg text-gray-900">No recipes yet.</p>
        <p className="mt-2 text-sm text-gray-600">
          Be the first to share a recipe!
        </p>
      </div>
    );
  }

  // Get like and comment counts for each recipe
  const recipeIds = recipes.map((r) => r.id);
  
  // Get like counts
  const { data: likesData } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  const likeCounts = likesData?.reduce((acc, like) => {
    acc[like.recipe_id] = (acc[like.recipe_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Get comment counts
  const { data: commentsData } = await supabase
    .from("recipe_comments")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  const commentCounts = commentsData?.reduce((acc, comment) => {
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
    recipesWithProfile = recipesWithProfile.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
  } else if (sortBy === "most_commented") {
    recipesWithProfile = recipesWithProfile.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipesWithProfile.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

