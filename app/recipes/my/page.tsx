import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeWithProfile } from "@/types/database";

export default async function MyRecipesPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const supabase = await createClient();

  const { data: recipes, error } = await supabase
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
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-800">Error loading recipes: {error.message}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recipesWithProfile: RecipeWithProfile[] =
    recipes?.map((recipe) => ({
      ...recipe,
      profile: Array.isArray(recipe.profiles)
        ? recipe.profiles[0]
        : recipe.profiles,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              My Recipes
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your recipes
            </p>
          </div>
          <Link
            href="/recipes/new"
            className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 shadow-sm"
          >
            Create Recipe
          </Link>
        </div>

        {recipesWithProfile.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-gray-900">You haven't created any recipes yet.</p>
            <p className="mt-2 text-sm text-gray-600">
              Start sharing your favorite recipes with the community!
            </p>
            <Link
              href="/recipes/new"
              className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 shadow-sm"
            >
              Create Your First Recipe
            </Link>
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

