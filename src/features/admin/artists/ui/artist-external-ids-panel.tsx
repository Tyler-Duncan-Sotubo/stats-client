"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useArtistExternalIds } from "../hooks/use-artist-external-ids";
import {
  createExternalIdSchema,
  type CreateExternalIdSchema,
} from "../schema/artist.schema";
import type { ArtistExternalId } from "../types/artist.types";

interface ArtistExternalIdsPanelProps {
  artistId: string;
  externalIds: ArtistExternalId[];
  onUpdate: () => void;
}

export function ArtistExternalIdsPanel({
  artistId,
  externalIds,
  onUpdate,
}: ArtistExternalIdsPanelProps) {
  const { addExternalId, deleteExternalId, loading } = useArtistExternalIds(
    artistId,
    onUpdate,
  );
  const [adding, setAdding] = useState(false);

  const form = useForm<CreateExternalIdSchema>({
    resolver: zodResolver(createExternalIdSchema),
    defaultValues: { source: "spotify", externalId: "", externalUrl: "" },
  });

  async function onSubmit(data: CreateExternalIdSchema) {
    await addExternalId(data);
    form.reset();
    setAdding(false);
  }

  return (
    <div className="space-y-3">
      {externalIds.length === 0 && (
        <p className="text-sm text-muted-foreground">No external IDs yet.</p>
      )}
      {externalIds.map((ext) => (
        <div
          key={ext.id}
          className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50"
        >
          <div>
            <span className="text-xs font-medium uppercase text-muted-foreground mr-2">
              {ext.source}
            </span>
            <span className="text-sm font-mono">{ext.externalId}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => deleteExternalId(ext.id)}
            disabled={loading}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 pt-2">
          <div className="flex gap-2">
            <Controller
              name="source"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spotify">Spotify</SelectItem>
                    <SelectItem value="kworb">Kworb</SelectItem>
                    <SelectItem value="musicbrainz">MusicBrainz</SelectItem>
                    <SelectItem value="apple_music">Apple Music</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              {...form.register("externalId")}
              placeholder="External ID"
              className="h-8 text-sm flex-1"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
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
          </div>
        </form>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setAdding(true)}
        >
          <Plus size={13} /> Add external ID
        </Button>
      )}
    </div>
  );
}
