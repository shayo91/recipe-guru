import Link from "next/link";

export function Header() {
  return (
    <nav className="border-b border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Recipe Guru
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/recipes"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Browse
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

