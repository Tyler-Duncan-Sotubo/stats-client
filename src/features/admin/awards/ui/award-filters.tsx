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
import type { AwardQuerySchema } from "../schema/award.schema";

interface AwardFiltersProps {
  query: Partial<AwardQuerySchema>;
  onUpdate: (updates: Partial<AwardQuerySchema>) => void;
}

export function AwardFilters({ query, onUpdate }: AwardFiltersProps) {
  const hasFilters =
    query.awardBody || query.result || query.territory || query.year;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Award body..."
        value={query.awardBody ?? ""}
        onChange={(e) => onUpdate({ awardBody: e.target.value || undefined })}
        className="h-9 w-44"
      />

      <Select
        value={query.result ?? "all"}
        onValueChange={(v) => onUpdate({ result: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All results</SelectItem>
          <SelectItem value="won">Won</SelectItem>
          <SelectItem value="nominated">Nominated</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Territory..."
        value={query.territory ?? ""}
        onChange={(e) => onUpdate({ territory: e.target.value || undefined })}
        className="h-9 w-36"
      />

      <Input
        placeholder="Year..."
        type="number"
        value={query.year ?? ""}
        onChange={(e) =>
          onUpdate({
            year: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="h-9 w-28"
      />

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground"
          onClick={() =>
            onUpdate({
              awardBody: undefined,
              result: undefined,
              territory: undefined,
              year: undefined,
            })
          }
        >
          <X size={14} /> Clear
        </Button>
      )}
    </div>
  );
}
