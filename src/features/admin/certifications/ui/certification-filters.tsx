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
import type { CertificationQuerySchema } from "../schema/certification.schema";

interface CertificationFiltersProps {
  query: Partial<CertificationQuerySchema>;
  onUpdate: (updates: Partial<CertificationQuerySchema>) => void;
}

export function CertificationFilters({
  query,
  onUpdate,
}: CertificationFiltersProps) {
  const hasFilters =
    query.territory || query.body || query.level || query.resolutionStatus;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Filter by territory..."
        value={query.territory ?? ""}
        onChange={(e) => onUpdate({ territory: e.target.value || undefined })}
        className="h-9 w-44"
      />

      <Input
        placeholder="Filter by body..."
        value={query.body ?? ""}
        onChange={(e) => onUpdate({ body: e.target.value || undefined })}
        className="h-9 w-36"
      />

      <Select
        value={query.level ?? "all"}
        onValueChange={(v) => onUpdate({ level: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          <SelectItem value="diamond">Diamond</SelectItem>
          <SelectItem value="platinum">Platinum</SelectItem>
          <SelectItem value="gold">Gold</SelectItem>
          <SelectItem value="silver">Silver</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={query.resolutionStatus ?? "all"}
        onValueChange={(v) =>
          onUpdate({ resolutionStatus: v === "all" ? undefined : v })
        }
      >
        <SelectTrigger className="h-9 w-40">
          <SelectValue placeholder="Resolution" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="matched">Matched</SelectItem>
          <SelectItem value="artist_only">Artist only</SelectItem>
          <SelectItem value="unresolved">Unresolved</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground"
          onClick={() =>
            onUpdate({
              territory: undefined,
              body: undefined,
              level: undefined,
              resolutionStatus: undefined,
            })
          }
        >
          <X size={14} /> Clear
        </Button>
      )}
    </div>
  );
}
