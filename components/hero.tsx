import Link from "next/link";

export function Hero() {
  return (
    <div className="mx-auto max-w-3xl py-24 text-center sm:py-32">
      <h2 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
        Share & Discover
        <br />
        <span className="text-gray-700">Amazing Recipes</span>
      </h2>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Join a community of home cooks and food enthusiasts. Create, explore,
        and share your favorite recipes with the world.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          href="/sign-up"
          className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 shadow-sm"
        >
          Start Sharing
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 shadow-sm"
        >
          Explore Recipes
        </Link>
      </div>
    </div>
  );
}

