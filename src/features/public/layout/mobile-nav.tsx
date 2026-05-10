"use client";

import { useState } from "react";
import {
  TrendingUp,
  Trophy,
  Users,
  BarChart2,
  GitCompare,
  Sparkles,
  Music,
  Megaphone,
  Menu,
  ChevronDown,
  ChevronRight,
  Medal,
  ListOrdered,
  Disc3,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import type { AvailableChart } from "@/lib/api/public";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const CHART_OVERRIDES: Record<string, string> = {
  tooxclusive_top_100: "TooXclusive Top 100",
  official_afrobeats_chart: "UK Afrobeats",
  billboard_hot_100: "Billboard Hot 100",
  spotify_daily_ng: "Spotify Nigeria",
};

const FEATURED_CHARTS = Object.keys(CHART_OVERRIDES);

function formatChartName(chartName: string): string {
  return (
    CHART_OVERRIDES[chartName] ??
    chartName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function NavLink({
  href,
  external,
  onClick,
  children,
}: {
  href: string;
  external?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
        isActive
          ? "font-semibold text-primary"
          : "text-foreground hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-border mx-3" />;
}

export function MobileNav({ charts }: { charts: AvailableChart[] }) {
  const [open, setOpen] = useState(false);
  const [chartsOpen, setChartsOpen] = useState(true);
  const close = () => setOpen(false);

  const featured = charts.filter((c) => FEATURED_CHARTS.includes(c.chartName));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0 overflow-y-auto z-9999">
        <SheetTitle className=" sr-only"></SheetTitle>
        <div className="py-4 flex flex-col">
          <SectionLabel>Discover</SectionLabel>
          <div className="px-2 space-y-0.5">
            <NavLink href="/" onClick={close}>
              <TrendingUp className="w-4 h-4 shrink-0" /> Home
            </NavLink>
            <NavLink href="/leaderboard" onClick={close}>
              <ListOrdered className="w-4 h-4 shrink-0" /> Leaderboards
            </NavLink>
          </div>

          <Divider />

          <SectionLabel>Explore</SectionLabel>
          <div className="px-2 space-y-0.5">
            <NavLink href="/artists" onClick={close}>
              <Users className="w-4 h-4 shrink-0" /> Artists
            </NavLink>
            <NavLink href="/albums" onClick={close}>
              <Disc3 className="w-4 h-4 shrink-0" /> Albums
            </NavLink>
            <NavLink href="/charts" onClick={close}>
              <BarChart2 className="w-4 h-4 shrink-0" /> Charts
            </NavLink>

            <NavLink href="/milestones" onClick={close}>
              <Medal className="w-4 h-4 shrink-0" /> Milestones
            </NavLink>
            <NavLink href="/rankings" onClick={close}>
              <Trophy className="w-4 h-4 shrink-0" /> Rankings
            </NavLink>
          </div>

          <Divider />

          <SectionLabel>Tools</SectionLabel>
          <div className="px-2 space-y-0.5">
            <NavLink href="/compare" onClick={close}>
              <GitCompare className="w-4 h-4 shrink-0" /> Compare
            </NavLink>
            <NavLink href="/ask" onClick={close}>
              <Sparkles className="w-4 h-4 shrink-0" /> Ask
            </NavLink>
          </div>

          {featured.length > 0 && (
            <>
              <Divider />
              <div className="px-3 pt-3 pb-1">
                <button
                  onClick={() => setChartsOpen((v) => !v)}
                  className="w-full flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Charts
                  {chartsOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              </div>
              {chartsOpen && (
                <div className="px-2 space-y-0.5">
                  {featured.map((c) => (
                    <NavLink
                      key={`${c.chartName}-${c.chartTerritory}`}
                      href={`/charts/${c.chartName}/${c.chartTerritory}`}
                      onClick={close}
                    >
                      {formatChartName(c.chartName)}
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          )}

          <Divider />

          <SectionLabel>TooXclusive</SectionLabel>
          <div className="px-2 space-y-0.5">
            <NavLink
              href="https://tooxclusive.com/category/download-mp3/"
              external
              onClick={close}
            >
              <Music className="w-4 h-4 shrink-0" /> New Music
            </NavLink>
            <NavLink
              href="https://tooxclusive.com/advertise/"
              external
              onClick={close}
            >
              <Megaphone className="w-4 h-4 shrink-0" /> Advertise
            </NavLink>
          </div>

          <Divider />

          <SectionLabel>Follow Us</SectionLabel>
          <div className="flex items-center gap-1 px-4 pb-3">
            <Link
              href="https://twitter.com/tooxclusive"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-foreground hover:text-muted-foreground transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="https://instagram.com/tooxclusive"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-foreground hover:text-muted-foreground transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link
              href="https://youtube.com/tooxclusive"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-foreground hover:text-muted-foreground transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
