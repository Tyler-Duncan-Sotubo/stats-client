// features/admin/ui/admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Music,
  Disc3,
  Library,
  Award,
  Trophy,
  Star,
  LayoutDashboard,
} from "lucide-react";
import { SignOutButton } from "./sign-out-button";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ── Nav config ────────────────────────────────────────────────────────────────

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: <LayoutDashboard size={15} />,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/artists", label: "Artists", icon: <Music size={15} /> },
      { href: "/admin/songs", label: "Songs", icon: <Disc3 size={15} /> },
      { href: "/admin/albums", label: "Albums", icon: <Library size={15} /> },
    ],
  },
  {
    title: "Achievements",
    items: [
      {
        href: "/admin/certifications",
        label: "Certifications",
        icon: <Award size={15} />,
      },
      { href: "/admin/awards", label: "Awards", icon: <Trophy size={15} /> },
      { href: "/admin/records", label: "Records", icon: <Star size={15} /> },
    ],
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface AdminSidebarProps {
  email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  return (
    <aside className="w-64 border-r bg-card hidden md:flex flex-col shrink-0 sticky top-0 h-screen">
      {/* Brand */}
      <div className="p-6 border-b">
        <h1 className="font-bold text-base tracking-tight">Stats Engine</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">
            {email}
          </p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}

// ── NavLink ───────────────────────────────────────────────────────────────────

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}
