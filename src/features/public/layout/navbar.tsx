"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AskBar } from "./ask-bar";
import { MobileNav } from "./mobile-nav";
import { AvailableChart } from "@/lib/api/public";

export function Navbar({ charts }: { charts: AvailableChart[] }) {
  return (
    <header className="shrink-0 h-14 border-b border-border bg-background backdrop-blur-sm flex items-center z-9998 sticky top-0">
      {/* Logo */}

      <div className="md:w-64 shrink-0 flex items-center px-4 h-full">
        <MobileNav charts={charts} />
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex-1 flex justify-between items-center gap-4 px-6">
        <AskBar />
        <Button variant="outline" size="sm" className="shrink-0 gap-2">
          <User className="w-4 h-4" />
          Sign in
        </Button>
      </div>
    </header>
  );
}
