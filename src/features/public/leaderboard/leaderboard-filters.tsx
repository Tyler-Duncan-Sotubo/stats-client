"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "ZA", label: "South Africa" },
  { value: "KE", label: "Kenya" },
  { value: "TZ", label: "Tanzania" },
  { value: "UG", label: "Uganda" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
];

interface LeaderboardFiltersProps {
  currentCountry?: string;
  currentTab: string;
}

export function LeaderboardFilters({
  currentCountry,
  currentTab,
}: LeaderboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  // hide country filter on songs tab
  if (currentTab === "songs") return null;

  return (
    <Select
      value={currentCountry ?? ""}
      onValueChange={(val) => updateParam("country", val || undefined)}
    >
      <SelectTrigger className="rounded-xl border-border bg-muted/40 text-xs font-semibold h-9 w-44">
        <SelectValue placeholder="All Countries" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
