import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeWithProfile } from "@/types/database";

export default async function SavedRecipesPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const supabase = await createClient();

  // Get all recipes the user has liked
  const { data: likes, error: likesError } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .eq("user_id", profile.id);

  if (likesError || !likes || likes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Saved Recipes
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Recipes you've liked
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-900">No saved recipes yet</p>
            <p className="mt-2 text-sm text-gray-600">
              Start liking recipes to save them here!
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recipeIds = likes.map((like) => like.recipe_id);

  // Get the recipes with their profiles
  const { data: recipes, error: recipesError } = await supabase
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
    )
    .in("id", recipeIds)
    .order("created_at", { ascending: false });

  if (recipesError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-800">
              Error loading saved recipes: {recipesError.message}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get like and comment counts for each recipe
  const { data: likesData } = await supabase
    .from("recipe_likes")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  const likeCounts = likesData?.reduce((acc, like) => {
    acc[like.recipe_id] = (acc[like.recipe_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const { data: commentsData } = await supabase
    .from("recipe_comments")
    .select("recipe_id")
    .in("recipe_id", recipeIds);

  const commentCounts = commentsData?.reduce((acc, comment) => {
    acc[comment.recipe_id] = (acc[comment.recipe_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const recipesWithProfile: RecipeWithProfile[] =
    recipes?.map((recipe) => ({
      ...recipe,
      profile: Array.isArray(recipe.profiles)
        ? recipe.profiles[0]
        : recipe.profiles,
      like_count: likeCounts[recipe.id] || 0,
      comment_count: commentCounts[recipe.id] || 0,
      is_liked: true, // All recipes on this page are liked
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Saved Recipes
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {recipesWithProfile.length} recipe
            {recipesWithProfile.length !== 1 ? "s" : ""} you've liked
          </p>
        </div>

        {recipesWithProfile.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-900">No saved recipes yet</p>
            <p className="mt-2 text-sm text-gray-600">
              Start liking recipes to save them here!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipesWithProfile.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

