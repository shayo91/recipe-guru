import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { updateRecipe } from "@/lib/actions/recipes";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const currentUser = await getCurrentUserProfile();

  if (!currentUser) {
    redirect("/sign-in");
  }

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  // Verify ownership
  if (recipe.user_id !== currentUser.id) {
    redirect(`/recipes/${id}`);
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    return await updateRecipe(id, formData);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <Link
            href={`/recipes/${id}`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            ← Back to Recipe
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            Edit Recipe
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your recipe information
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <RecipeForm
            onSubmit={handleUpdate}
            initialData={{
              title: recipe.title,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
              image_url: recipe.image_url,
              cooking_time: recipe.cooking_time,
              difficulty: recipe.difficulty,
              category: recipe.category,
            }}
            submitLabel="Update Recipe"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

