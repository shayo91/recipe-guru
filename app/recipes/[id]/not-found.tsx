import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        <div className="rounded-xl border border-white/20 bg-white/10 p-12 text-center backdrop-blur-md shadow-lg shadow-orange-500/30">
          <h1 className="text-4xl font-semibold text-white">Recipe Not Found</h1>
          <p className="mt-4 text-white/70">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-white/20 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-lg hover:shadow-orange-500/30"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

