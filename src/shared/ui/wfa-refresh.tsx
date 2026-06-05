// src/shared/ui/wfa-refresh.tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function WfaRefresh() {
  const pathname = usePathname();
  useEffect(() => {
    (window as any).wfa?.refresh();
  }, [pathname]);
  return null;
}
