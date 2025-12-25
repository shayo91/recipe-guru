import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SavedRecipesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="h-48 w-full animate-pulse bg-gray-200" />
              <div className="p-6">
                <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="mb-4 flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="mt-4 flex gap-4">
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

