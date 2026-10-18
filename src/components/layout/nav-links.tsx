"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import type { NavItem } from "@/lib/site";

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, className }: { items: readonly NavItem[]; className?: string }) {
  const pathname = usePathname();
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "text-foreground",
              )}
            >
              {item.label}
              {active && (
                <span
                  aria-hidden
                  className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-brand"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
