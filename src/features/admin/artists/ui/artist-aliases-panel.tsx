"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Star, Trash2, Plus } from "lucide-react";
import { useArtistAliases } from "../hooks/use-artist-aliases";
import {
  createAliasSchema,
  type CreateAliasSchema,
} from "../schema/artist.schema";
import type { ArtistAlias } from "../types/artist.types";

interface ArtistAliasesPanelProps {
  artistId: string;
  aliases: ArtistAlias[];
  onUpdate: () => void;
}

export function ArtistAliasesPanel({
  artistId,
  aliases,
  onUpdate,
}: ArtistAliasesPanelProps) {
  const { addAlias, setPrimary, deleteAlias, loading } = useArtistAliases(
    artistId,
    onUpdate,
  );
  const [adding, setAdding] = useState(false);

  const form = useForm<CreateAliasSchema>({
    resolver: zodResolver(createAliasSchema),
    defaultValues: { alias: "", isPrimary: false },
  });

  async function onSubmit(data: CreateAliasSchema) {
    await addAlias(data);
    form.reset();
    setAdding(false);
  }

  return (
    <div className="space-y-3">
      {/* List */}
      {aliases.length === 0 && (
        <p className="text-sm text-muted-foreground">No aliases yet.</p>
      )}
      {aliases.map((alias) => (
        <div
          key={alias.id}
          className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{alias.alias}</span>
            {alias.isPrimary && (
              <Badge variant="secondary" className="text-xs">
                Primary
              </Badge>
            )}
            {alias.source && (
              <span className="text-xs text-muted-foreground">
                {alias.source}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!alias.isPrimary && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPrimary(alias.id)}
                disabled={loading}
              >
                <Star size={13} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => deleteAlias(alias.id)}
              disabled={loading}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
      ))}

      {/* Add form */}
      {adding ? (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 pt-2"
        >
          <Input
            {...form.register("alias")}
            placeholder="Alias name"
            className="h-8 text-sm"
            autoFocus
          />
          <Button type="submit" size="sm" disabled={loading}>
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAdding(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 mt-1"
          onClick={() => setAdding(true)}
        >
          <Plus size={13} /> Add alias
        </Button>
      )}
    </div>
  );
}
