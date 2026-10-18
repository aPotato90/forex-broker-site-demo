"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DEMO_NOTICE, type NavItem } from "@/lib/site";
import { isActivePath } from "./nav-links";

export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <MenuIcon aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] max-w-sm">
        <SheetHeader className="border-b">
          <SheetTitle>Valtrex Markets</SheetTitle>
          <SheetDescription>{DEMO_NOTICE}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-2">
          <ul className="flex flex-col gap-1">
            {[{ href: "/", label: "Home" }, ...items, { href: "/about", label: "About" }].map(
              (item) => {
                const active =
                  item.href === "/" ? pathname === "/" : isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center rounded-lg px-3 text-base font-medium hover:bg-muted",
                        active && "bg-muted text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        </nav>
        <div className="mt-auto border-t p-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/open-account" onClick={() => setOpen(false)}>
              Open a demo account
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
