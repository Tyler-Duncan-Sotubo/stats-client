"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

const SORT_OPTIONS = [
  { value: "totalStreams", label: "Most Streamed" },
  { value: "monthlyListeners", label: "Most Listeners" },
  { value: "name", label: "A–Z" },
];

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

interface ArtistsFiltersProps {
  currentSort: string;
  currentCountry?: string;
  currentLetter?: string;
}

export function ArtistsFilters({
  currentSort,
  currentCountry,
  currentLetter,
}: ArtistsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const ALL_COUNTRIES = "__all__";

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters =
    currentLetter || currentCountry || currentSort !== "totalStreams";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Sort */}
      <Tabs
        value={currentSort}
        onValueChange={(val) => updateParam("sortBy", val)}
      >
        <TabsList className="bg-transparent gap-2 p-0 h-auto">
          {SORT_OPTIONS.map((opt) => (
            <TabsTrigger key={opt.value} value={opt.value}>
              {opt.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Select
        value={currentCountry ?? ALL_COUNTRIES}
        onValueChange={(val) => {
          updateParam("country", val === ALL_COUNTRIES ? undefined : val);
        }}
      >
        <SelectTrigger className="rounded-xl border-border bg-muted/40 text-sm font-semibold h-9 w-40">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_COUNTRIES}>All Countries</SelectItem>
          {COUNTRIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
