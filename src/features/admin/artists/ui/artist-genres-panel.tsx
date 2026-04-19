"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Star, Trash2, Plus } from "lucide-react";
import { useArtistGenres } from "../hooks/use-artist-genres";
import {
  createGenreSchema,
  type CreateGenreSchema,
} from "../schema/artist.schema";
import type { ArtistGenre } from "../types/artist.types";

interface ArtistGenresPanelProps {
  artistId: string;
  genres: ArtistGenre[];
  onUpdate: () => void;
}

export function ArtistGenresPanel({
  artistId,
  genres,
  onUpdate,
}: ArtistGenresPanelProps) {
  const { addGenre, setPrimary, deleteGenre, loading } = useArtistGenres(
    artistId,
    onUpdate,
  );
  const [adding, setAdding] = useState(false);

  const form = useForm<CreateGenreSchema>({
    resolver: zodResolver(createGenreSchema),
    defaultValues: { genre: "", isPrimary: false },
  });

  async function onSubmit(data: CreateGenreSchema) {
    await addGenre(data);
    form.reset();
    setAdding(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {genres.length === 0 && (
          <p className="text-sm text-muted-foreground">No genres yet.</p>
        )}
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="flex items-center gap-1 bg-muted rounded-full px-3 py-1"
          >
            <span className="text-xs font-medium">{genre.genre}</span>
            {genre.isPrimary && <Star size={10} className="text-primary" />}
            <button
              onClick={() => !genre.isPrimary && setPrimary(genre.id)}
              className="ml-1 text-muted-foreground hover:text-foreground"
              disabled={loading || genre.isPrimary}
            ></button>
            <button
              onClick={() => deleteGenre(genre.id)}
              className="ml-0.5 text-muted-foreground hover:text-destructive"
              disabled={loading}
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <Input
            {...form.register("genre")}
            placeholder="Genre name"
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
          className="gap-1.5"
          onClick={() => setAdding(true)}
        >
          <Plus size={13} /> Add genre
        </Button>
      )}
    </div>
  );
}
