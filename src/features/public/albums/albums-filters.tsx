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
  { value: "__all__", label: "All" },
  { value: "album", label: "Albums" },
  { value: "single", label: "Singles" },
  { value: "ep", label: "EPs" },
];

interface AlbumsFiltersProps {
  currentSort: string;
  currentAlbumType?: string;
}

export function AlbumsFilters({
  currentSort,
  currentAlbumType,
}: AlbumsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const hasFilters = currentAlbumType || currentSort !== "totalStreams";

  return (
    <div className="flex items-center gap-3 flex-wrap">
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
        <SelectTrigger className="rounded-xl border-border bg-muted/40 text-sm font-semibold h-9 w-32">
          <SelectValue placeholder="All" />
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
          Clear filters
        </button>
      )}
    </div>
  );
}
