import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { signOut } from "@/lib/actions/auth";
import Link from "next/link";
import { NavLinks } from "./nav-links";

export async function UserMenu() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return (
      <div className="flex items-center gap-6">
        <Link
          href="/sign-in"
          className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 shadow-sm"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <NavLinks
        links={[
          { href: "/dashboard", label: "Browse Recipes" },
          { href: "/recipes/my", label: "My Recipes" },
          { href: "/recipes/saved", label: "Saved Recipes" },
          { href: "/recipes/new", label: "Create Recipe" },
        ]}
      />
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="text-sm font-semibold text-gray-900 transition-colors hover:text-gray-700"
        >
          {profile.username}
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}

