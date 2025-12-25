import Link from "next/link";
import { RecipeWithProfile } from "@/types/database";

interface RecipeCardProps {
  recipe: RecipeWithProfile;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const formatTime = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group block rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden"
    >
      {recipe.image_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              {recipe.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              by{" "}
              <span className="font-medium text-gray-900">
                {recipe.profile.username}
              </span>
            </p>
          </div>
        </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {recipe.category && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {recipe.category}
          </span>
        )}
        {recipe.difficulty && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {recipe.difficulty}
          </span>
        )}
        {recipe.cooking_time && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {formatTime(recipe.cooking_time)}
          </span>
        )}
      </div>

        {recipe.ingredients && (
          <p className="mt-4 line-clamp-2 text-sm text-gray-600">
            {recipe.ingredients.substring(0, 100)}
            {recipe.ingredients.length > 100 ? "..." : ""}
          </p>
        )}

        {/* Like and Comment Counts */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{recipe.like_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{recipe.comment_count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

