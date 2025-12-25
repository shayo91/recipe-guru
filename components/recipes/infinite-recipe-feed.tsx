"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeWithProfile } from "@/types/database";
import { fetchRecipes } from "@/lib/actions/recipes-feed";

interface InfiniteRecipeFeedProps {
  initialRecipes: RecipeWithProfile[];
  initialHasMore: boolean;
  category?: string | null;
  difficulty?: string | null;
  search?: string | null;
  sortBy?: string | null;
}

export function InfiniteRecipeFeed({
  initialRecipes,
  initialHasMore,
  category,
  difficulty,
  search,
  sortBy = "newest",
}: InfiniteRecipeFeedProps) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const filtersKey = useMemo(
    () => `${category}-${difficulty}-${search}-${sortBy}`,
    [category, difficulty, search, sortBy]
  );
  const prevFiltersKey = useRef<string>(filtersKey);

  // Reset when filters change
  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      setRecipes(initialRecipes);
      setHasMore(initialHasMore);
      setPage(1);
      setIsLoading(false);
      prevFiltersKey.current = filtersKey;
    }
  }, [filtersKey, initialRecipes, initialHasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          fetchRecipes({
            category,
            difficulty,
            search,
            sortBy: sortBy || "newest",
            page,
            pageSize: 12,
          }).then((result) => {
            if (result.error) {
              console.error("Error loading recipes:", result.error);
              setIsLoading(false);
              return;
            }
            setRecipes((prev) => [...prev, ...result.recipes]);
            setHasMore(result.hasMore);
            setPage((prev) => prev + 1);
            setIsLoading(false);
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, page, category, difficulty, search, sortBy]);

  if (recipes.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg text-gray-900">No recipes found.</p>
        <p className="mt-2 text-sm text-gray-600">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Loading indicator and observer target */}
      <div ref={observerTarget} className="mt-8">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading more recipes...</span>
            </div>
          </div>
        )}
        {!hasMore && recipes.length > 0 && (
          <div className="py-8 text-center text-sm text-gray-500">
            No more recipes to load
          </div>
        )}
      </div>
    </>
  );
}

