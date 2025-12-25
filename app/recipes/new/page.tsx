import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { createRecipe } from "@/lib/actions/recipes";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewRecipePage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            Create New Recipe
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Share your favorite recipe with the community
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <RecipeForm onSubmit={createRecipe} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

