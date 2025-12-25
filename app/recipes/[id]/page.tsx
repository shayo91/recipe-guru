import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteRecipe } from "@/lib/actions/recipes";
import { RecipeActions } from "@/components/recipes/recipe-actions";
import { LikeButton } from "@/components/recipes/like-button";
import { CommentSection } from "@/components/recipes/comment-section";
import { CommentWithProfile } from "@/types/database";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const currentUser = await getCurrentUserProfile();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      profiles!inner (
        id,
        username,
        email,
        full_name,
        bio
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  const profile = Array.isArray(recipe.profiles)
    ? recipe.profiles[0]
    : recipe.profiles;

  const isOwner = currentUser?.id === recipe.user_id;

  // Get like count and check if current user liked
  const { count: likeCount } = await supabase
    .from("recipe_likes")
    .select("*", { count: "exact", head: true })
    .eq("recipe_id", id);

  let isLiked = false;
  if (currentUser) {
    const { data: likeData } = await supabase
      .from("recipe_likes")
      .select("id")
      .eq("recipe_id", id)
      .eq("user_id", currentUser.id)
      .single();
    isLiked = !!likeData;
  }

  // Get comments with profiles
  const { data: comments } = await supabase
    .from("recipe_comments")
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
    .eq("recipe_id", id)
    .order("created_at", { ascending: true });

  const commentsWithProfile: CommentWithProfile[] =
    comments?.map((comment) => ({
      ...comment,
      profile: Array.isArray(comment.profiles)
        ? comment.profiles[0]
        : comment.profiles,
    })) || [];

  const formatTime = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hour${hours > 1 ? "s" : ""} ${mins} minute${mins > 1 ? "s" : ""}` : `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <article className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Recipe Image */}
          {recipe.image_url && (
            <div className="relative h-64 w-full overflow-hidden md:h-96">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                  {recipe.title}
                </h1>
                <div className="mt-4 flex items-center gap-4">
                  <Link
                    href={`/users/${profile.username}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    by <span className="font-medium">{profile.username}</span>
                  </Link>
                  {recipe.created_at && (
                    <span className="text-sm text-gray-500">
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {isOwner && <RecipeActions recipeId={recipe.id} />}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3">
              {recipe.category && (
                <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                  {recipe.category}
                </span>
              )}
              {recipe.difficulty && (
                <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                  {recipe.difficulty}
                </span>
              )}
              {recipe.cooking_time && (
                <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700">
                  {formatTime(recipe.cooking_time)}
                </span>
              )}
              <LikeButton
                recipeId={recipe.id}
                initialLiked={isLiked}
                initialCount={likeCount || 0}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Ingredients
            </h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <div className="whitespace-pre-line text-gray-700">
                {recipe.ingredients}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Instructions
            </h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <div className="whitespace-pre-line text-gray-700">
                {recipe.instructions}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            recipeId={recipe.id}
            initialComments={commentsWithProfile}
            currentUserId={currentUser?.id}
          />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

