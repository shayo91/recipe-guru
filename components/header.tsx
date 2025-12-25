import Link from "next/link";
import { UserMenu } from "@/components/auth/user-menu";

export async function Header() {
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
            >
              Recipe Guru
            </Link>
          </div>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

