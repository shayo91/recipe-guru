import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Recipes
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Browse all recipes coming soon...
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

