import { fetchRecipes } from "@/lib/actions/recipes-feed";
import { InfiniteRecipeFeed } from "@/components/recipes/infinite-recipe-feed";

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
  // Fetch first page
  const result = await fetchRecipes({
    category,
    difficulty,
    search,
    sortBy: sortBy || "newest",
    page: 0,
    pageSize: 12,
  });

  if (result.error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-800">Error loading recipes: {result.error}</p>
      </div>
    );
  }

  return (
    <InfiniteRecipeFeed
      initialRecipes={result.recipes}
      initialHasMore={result.hasMore}
      category={category}
      difficulty={difficulty}
      search={search}
      sortBy={sortBy}
    />
  );
}

