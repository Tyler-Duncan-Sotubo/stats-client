"use client";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { X } from "lucide-react";
import type { AlbumQuerySchema } from "../schema/album.schema";

interface AlbumFiltersProps {
  query: Partial<AlbumQuerySchema>;
  onUpdate: (updates: Partial<AlbumQuerySchema>) => void;
}

export function AlbumFilters({ query, onUpdate }: AlbumFiltersProps) {
  const hasFilters =
    query.search || query.albumType || query.isAfrobeats !== undefined;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Search albums..."
        value={query.search ?? ""}
        onChange={(e) => onUpdate({ search: e.target.value || undefined })}
        className="h-9 w-56"
      />

      <Select
        value={query.albumType ?? "all"}
        onValueChange={(v) =>
          onUpdate({ albumType: v === "all" ? undefined : v })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="album">Album</SelectItem>
          <SelectItem value="single">Single</SelectItem>
          <SelectItem value="ep">EP</SelectItem>
          <SelectItem value="compilation">Compilation</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={
          query.isAfrobeats === undefined
            ? "all"
            : query.isAfrobeats
              ? "true"
              : "false"
        }
        onValueChange={(v) =>
          onUpdate({ isAfrobeats: v === "all" ? undefined : v === "true" })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Afrobeats" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All genres</SelectItem>
          <SelectItem value="true">Afrobeats</SelectItem>
          <SelectItem value="false">Non-Afrobeats</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground"
          onClick={() =>
            onUpdate({
              search: undefined,
              albumType: undefined,
              isAfrobeats: undefined,
            })
          }
        >
          <X size={14} /> Clear
        </Button>
      )}
    </div>
  );
}
