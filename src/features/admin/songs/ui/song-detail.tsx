"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, ArrowLeft, Flag } from "lucide-react";
import { useSong } from "../hooks/use-song";
import { useUpdateSong } from "../hooks/use-update-song";
import { useDeleteSong } from "../hooks/use-delete-song";
import { SongForm } from "./song-form";
import { SongAliasesPanel } from "./song-aliases-panel";
import { SongExternalIdsPanel } from "./song-external-ids-panel";
import { SongFeaturesPanel } from "./song-features-panel";
import { SongMergeDialog } from "./song-merge-dialog";
import type { UpdateSongSchema } from "../schema/song.schema";

interface SongDetailProps {
  id: string;
}

export function SongDetail({ id }: SongDetailProps) {
  const { song, loading, error, refetch } = useSong(id);
  const {
    updateSong,
    loading: updating,
    error: updateError,
  } = useUpdateSong(id, refetch);
  const { deleteSong, loading: deleting } = useDeleteSong();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex items-center gap-2 text-destructive py-8">
        <AlertCircle size={16} /> {error ?? "Song not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/songs">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={15} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{song.title}</h1>
            <p className="text-xs text-muted-foreground">{song.slug}</p>
          </div>
          {song.needsReview && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle size={11} /> Needs review
            </Badge>
          )}
          {song.explicit && (
            <Badge variant="outline" className="text-xs">
              Explicit
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => updateSong({ needsReview: !song.needsReview })}
            disabled={updating}
          >
            <Flag size={14} />
            {song.needsReview ? "Clear review" : "Flag review"}
          </Button>
          <SongMergeDialog songId={id} songTitle={song.title} />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteSong(id, song.title)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SongForm
            defaultValues={song}
            onSubmit={(data) => updateSong(data as UpdateSongSchema)}
            loading={updating}
            error={updateError}
            submitLabel="Update song"
          />
        </CardContent>
      </Card>

      {/* Aliases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aliases</CardTitle>
        </CardHeader>
        <CardContent>
          <SongAliasesPanel
            songId={id}
            aliases={song.aliases}
            onUpdate={refetch}
          />
        </CardContent>
      </Card>

      {/* External IDs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">External IDs</CardTitle>
        </CardHeader>
        <CardContent>
          <SongExternalIdsPanel
            songId={id}
            externalIds={song.externalIds}
            onUpdate={refetch}
          />
        </CardContent>
      </Card>

      {/* Featured artists */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Featured artists</CardTitle>
        </CardHeader>
        <CardContent>
          <SongFeaturesPanel
            songId={id}
            features={song.features}
            onUpdate={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
}
