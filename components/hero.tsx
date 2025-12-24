import Link from "next/link";

export function Hero() {
  return (
    <div className="mx-auto max-w-3xl py-24 text-center sm:py-32">
      <h2 className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
        Share & Discover
        <br />
        <span className="text-zinc-600 dark:text-zinc-400">
          Amazing Recipes
        </span>
      </h2>
      <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Join a community of home cooks and food enthusiasts. Create, explore,
        and share your favorite recipes with the world.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          href="/sign-up"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start Sharing
        </Link>
        <Link
          href="/recipes"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Explore Recipes
        </Link>
      </div>
    </div>
  );
}

