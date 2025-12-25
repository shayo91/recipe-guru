"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinksProps {
  links: Array<{ href: string; label: string }>;
}

export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? "text-gray-900 font-semibold"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

