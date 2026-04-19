"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function AdminNavLink({ href, label, icon: Icon }: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
    >
      <Icon size={15} />
      {label}
    </Link>
  );
}
