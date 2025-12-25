import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function RecipeLoading() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        <article className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Image skeleton */}
          <div className="h-64 w-full animate-pulse bg-gray-200 md:h-96" />

          <div className="p-8">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 h-10 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Meta info skeleton */}
              <div className="flex flex-wrap gap-3">
                <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
                <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
                <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200" />
              </div>
            </div>

            {/* Ingredients skeleton */}
            <div className="mb-8">
              <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200" />
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>

            {/* Instructions skeleton */}
            <div>
              <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200" />
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <div className="space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

