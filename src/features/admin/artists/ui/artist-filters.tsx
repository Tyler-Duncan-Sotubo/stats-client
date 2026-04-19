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
import type { ArtistQuerySchema } from "../schema/artist.schema";

interface ArtistFiltersProps {
  query: Partial<ArtistQuerySchema>;
  onUpdate: (updates: Partial<ArtistQuerySchema>) => void;
}

export function ArtistFilters({ query, onUpdate }: ArtistFiltersProps) {
  const hasFilters =
    query.search ||
    query.originCountry ||
    query.isAfrobeats !== undefined ||
    query.entityStatus ||
    query.needsReview !== undefined;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Search artists..."
        value={query.search ?? ""}
        onChange={(e) => onUpdate({ search: e.target.value || undefined })}
        className="h-9 w-56"
      />

      <Select
        value={query.entityStatus ?? "all"}
        onValueChange={(v) =>
          onUpdate({ entityStatus: v === "all" ? undefined : v })
        }
      >
        <SelectTrigger className="h-9 w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="canonical">Canonical</SelectItem>
          <SelectItem value="provisional">Provisional</SelectItem>
          <SelectItem value="merged">Merged</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
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

      <Select
        value={
          query.needsReview === undefined
            ? "all"
            : query.needsReview
              ? "true"
              : "false"
        }
        onValueChange={(v) =>
          onUpdate({ needsReview: v === "all" ? undefined : v === "true" })
        }
      >
        <SelectTrigger className="h-9 w-40">
          <SelectValue placeholder="Review" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All artists</SelectItem>
          <SelectItem value="true">Needs review</SelectItem>
          <SelectItem value="false">Reviewed</SelectItem>
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
              originCountry: undefined,
              isAfrobeats: undefined,
              entityStatus: undefined,
              needsReview: undefined,
            })
          }
        >
          <X size={14} /> Clear
        </Button>
      )}
    </div>
  );
}
