import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks items={mainNav} />
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild size="lg" className="hidden sm:inline-flex">
            <Link href="/open-account">Open demo account</Link>
          </Button>
          <MobileNav items={mainNav} />
        </div>
      </div>
    </header>
  );
}
