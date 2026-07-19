"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navItems, orgInfo } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="mr-auto flex shrink-0 items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-full bg-cocoa-900 p-1">
            <Image
              src="/logo.png"
              alt={orgInfo.name}
              width={40}
              height={40}
              className="size-full rounded-full object-contain"
            />
          </span>
          <span className="hidden font-heading text-lg sm:inline">
            {orgInfo.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-heading text-[15px] transition-colors hover:text-primary",
                isActive(item.href) ? "text-primary" : "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild className="hidden md:inline-flex">
          <Link href="/membership/apply">Become a Member</Link>
        </Button>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-full p-2 text-foreground hover:bg-foreground/5 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 font-heading text-[15px]",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-foreground/5",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/membership/apply" onClick={() => setMobileOpen(false)}>
                Become a Member
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
