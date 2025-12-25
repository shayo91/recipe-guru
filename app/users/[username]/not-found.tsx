import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <h1 className="text-4xl font-semibold text-gray-900">User Not Found</h1>
          <p className="mt-4 text-gray-600">
            The user you're looking for doesn't exist.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

