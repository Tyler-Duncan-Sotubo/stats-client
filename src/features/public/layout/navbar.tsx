"use client";

import Link from "next/link";
import { GitCompare, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AskBar } from "./ask-bar";
import { MobileNav } from "./mobile-nav";
import { AvailableChart } from "@/lib/api/public";
import { Logo, LogoMark } from "@/shared/ui/logo";

export function Navbar({ charts }: { charts: AvailableChart[] }) {
  return (
    <header className="shrink-0 h-14 border-b border-border bg-background backdrop-blur-sm flex items-center z-9998 sticky top-0">
      {/* Logo */}

      <div className="md:w-64 shrink-0 flex items-center px-4 h-full">
        <MobileNav charts={charts} />
        <LogoMark size="lg" />
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center gap-2 px-3">
        <AskBar />
        <Link href="/compare" className="md:hidden shrink-0">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <GitCompare className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
