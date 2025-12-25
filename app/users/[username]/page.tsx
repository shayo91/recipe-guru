import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeWithProfile } from "@/types/database";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Get user's recipes
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
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

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
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                {profile.full_name || profile.username}
              </h1>
              <p className="mt-1 text-lg text-gray-600">@{profile.username}</p>
              {profile.bio && (
                <p className="mt-4 text-gray-700">{profile.bio}</p>
              )}
              {profile.email && (
                <p className="mt-2 text-sm text-gray-500">{profile.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* User's Recipes */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Recipes ({recipesWithProfile.length})
          </h2>

          {recipesWithProfile.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg text-gray-900">
                {profile.username} hasn't created any recipes yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipesWithProfile.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

