import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RecipeFeed } from "@/components/recipe-feed";
import { RecipeFilters } from "@/components/recipes/recipe-filters";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface DashboardPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    search?: string;
    sortBy?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const profile = await getCurrentUserProfile();
  const params = await searchParams;

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Browse Recipes
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Discover recipes from the community
            </p>
          </div>
          <Link
            href="/recipes/new"
            className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 shadow-sm"
          >
            Create Recipe
          </Link>
        </div>

        <RecipeFilters />
        <RecipeFeed
          category={params.category}
          difficulty={params.difficulty}
          search={params.search}
          sortBy={params.sortBy}
        />
      </main>
      <Footer />
    </div>
  );
}

