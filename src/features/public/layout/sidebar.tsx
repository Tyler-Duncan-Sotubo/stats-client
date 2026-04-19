"use client";

import {
  TrendingUp,
  Trophy,
  Users,
  BarChart2,
  GitCompare,
  Sparkles,
  Music,
  Megaphone,
} from "lucide-react";

import { SidebarLink } from "./sidebar-link";
import { SidebarCharts } from "./sidebar-charts";
import type { AvailableChart } from "@/lib/api/public";

export function Sidebar({ charts }: { charts: AvailableChart[] }) {
  return (
    <aside className="w-64 shrink-0 pl-4 py-6 hidden lg:block">
      <div className="sticky top-6">
        <nav className="rounded-xl border border-border bg-sidebar shadow-sm overflow-hidden">
          {/* Discover */}
          <div className="px-3 py-3 border-b border-border">
            <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Discover
            </p>
            <div className="space-y-0.5">
              <SidebarLink href="/">
                <TrendingUp className="w-4.5 h-4.5 mr-2 shrink-0" />
                Home
              </SidebarLink>
              <SidebarLink href="/leaderboard">
                <Trophy className="w-4.5 h-4.5 mr-2 shrink-0" />
                Leaderboards
              </SidebarLink>
            </div>
          </div>

          {/* Explore */}
          <div className="px-3 py-3 border-b border-border">
            <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Explore
            </p>
            <div className="space-y-0.5">
              <SidebarLink href="/artists">
                <Users className="w-4.5 h-4.5 mr-2 shrink-0" />
                Artists
              </SidebarLink>
              <SidebarLink href="/charts">
                <BarChart2 className="w-4.5 h-4.5 mr-2 shrink-0" />
                Charts
              </SidebarLink>
            </div>
          </div>

          {/* Tools */}
          <div className="px-3 py-3 border-b border-border">
            <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tools
            </p>
            <div className="space-y-0.5">
              <SidebarLink href="/compare">
                <GitCompare className="w-4.5 h-4.5 mr-2 shrink-0" />
                Compare
              </SidebarLink>
              <SidebarLink href="/ask">
                <Sparkles className="w-4.5 h-4.5 mr-2 shrink-0" />
                Ask
              </SidebarLink>
            </div>
          </div>

          {/* Charts */}
          <div className="px-3 py-3 border-b border-border">
            <SidebarCharts charts={charts} />
          </div>
        </nav>
        <nav className="rounded-xl border border-border bg-sidebar shadow-sm overflow-hidden mt-10">
          {/* TooXclusive */}
          <div className="px-3 py-3 border-b border-border">
            <p className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              TooXclusive
            </p>
            <div className="space-y-0.5">
              <SidebarLink
                href="https://tooxclusive.com/category/download-mp3/"
                external
              >
                <Music className="w-4.5 h-4.5 mr-2 shrink-0" />
                New Music
              </SidebarLink>
              <SidebarLink href="https://tooxclusive.com/advertise/" external>
                <Megaphone className="w-4.5 h-4.5 mr-2 shrink-0" />
                Advertise
              </SidebarLink>
            </div>
          </div>

          {/* Social */}
          <div className="px-3 py-3">
            <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Follow Us
            </p>
            <div className="flex items-center gap-1 px-2">
              {/* X (Twitter) */}
              <a
                href="https://twitter.com/tooxclusive"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white hover:text-muted hover:font-bold transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/tooxclusive"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white hover:text-muted hover:font-bold transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/tooxclusive"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white hover:text-muted hover:font-bold transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
