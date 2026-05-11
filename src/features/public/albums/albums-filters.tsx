"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const SORT_OPTIONS = [
  { value: "totalStreams", label: "Most Streamed" },
  { value: "dailyStreams", label: "Trending" },
  { value: "releaseDate", label: "Latest" },
];

const ALBUM_TYPES = [
  { value: "__all__", label: "All Types" },
  { value: "album", label: "Albums" },
  { value: "single", label: "Singles" },
  { value: "ep", label: "EPs" },
];

interface AlbumsFiltersProps {
  currentSort: string;
  currentAlbumType?: string;
  currentIsAfrobeats?: boolean;
}

export function AlbumsFilters({
  currentSort,
  currentAlbumType,
  currentIsAfrobeats,
}: AlbumsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== undefined) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters =
    currentAlbumType ||
    currentSort !== "totalStreams" ||
    currentIsAfrobeats !== undefined;

  const afrobeatsValue =
    currentIsAfrobeats === true
      ? "afrobeats"
      : currentIsAfrobeats === false
        ? "global"
        : "all";

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1 — Genre filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium w-12 shrink-0">
          Genre
        </span>
        <Tabs
          value={afrobeatsValue}
          onValueChange={(val) => {
            if (val === "afrobeats") updateParam("isAfrobeats", "true");
            else if (val === "global") updateParam("isAfrobeats", "false");
            else updateParam("isAfrobeats", undefined);
          }}
        >
          <TabsList className="bg-transparent gap-2 p-0 h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="afrobeats">Afrobeats</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Row 2 — Sort + Type */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium w-12 shrink-0">
          Sort
        </span>
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
          value={currentAlbumType ?? "__all__"}
          onValueChange={(val) =>
            updateParam("albumType", val === "__all__" ? undefined : val)
          }
        >
          <SelectTrigger className="rounded-xl border-border bg-muted/40 text-sm font-semibold h-9 w-36">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {ALBUM_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            onClick={() => router.push(pathname)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
