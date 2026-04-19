"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SidebarLink({
  href,
  children,
  disabled,
  external,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (disabled) {
    return (
      <span className="flex items-center px-2 py-1.5 rounded-md text-sm text-muted-foreground/40 cursor-not-allowed select-none">
        {children}
      </span>
    );
  }

  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-2 py-1.5 text-sm text-white hover:text-muted hover:font-bold rounded-lg transition-colors"
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-2 py-1.5 rounded-md text-[15px] transition-colors font-medium",
        isActive
          ? "font-bold text-primary"
          : "text-white hover:text-muted hover:font-bold",
      )}
    >
      {children}
    </Link>
  );
}
