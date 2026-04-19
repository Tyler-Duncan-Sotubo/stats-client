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
import type { RecordQuerySchema } from "../schema/record.schema";

interface RecordFiltersProps {
  query: Partial<RecordQuerySchema>;
  onUpdate: (updates: Partial<RecordQuerySchema>) => void;
}

export function RecordFilters({ query, onUpdate }: RecordFiltersProps) {
  const hasFilters =
    query.recordType || query.scope || query.isActive !== undefined;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Record type..."
        value={query.recordType ?? ""}
        onChange={(e) => onUpdate({ recordType: e.target.value || undefined })}
        className="h-9 w-44"
      />

      <Input
        placeholder="Scope..."
        value={query.scope ?? ""}
        onChange={(e) => onUpdate({ scope: e.target.value || undefined })}
        className="h-9 w-36"
      />

      <Select
        value={
          query.isActive === undefined
            ? "all"
            : query.isActive
              ? "true"
              : "false"
        }
        onValueChange={(v) =>
          onUpdate({ isActive: v === "all" ? undefined : v === "true" })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All records</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Broken</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground"
          onClick={() =>
            onUpdate({
              recordType: undefined,
              scope: undefined,
              isActive: undefined,
            })
          }
        >
          <X size={14} /> Clear
        </Button>
      )}
    </div>
  );
}
