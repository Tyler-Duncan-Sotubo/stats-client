"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, ArrowLeft, Flag } from "lucide-react";
import { useArtist } from "../hooks/use-artist";
import { useUpdateArtist } from "../hooks/use-update-artist";
import { useDeleteArtist } from "../hooks/use-delete-artist";
import { ArtistForm } from "./artist-form";
import { ArtistAliasesPanel } from "./artist-aliases-panel";
import { ArtistGenresPanel } from "./artist-genres-panel";
import { ArtistExternalIdsPanel } from "./artist-external-ids-panel";
import { ArtistMergeDialog } from "./artist-merge-dialog";
import type { UpdateArtistSchema } from "../schema/artist.schema";

interface ArtistDetailProps {
  id: string;
}

export function ArtistDetail({ id }: ArtistDetailProps) {
  const { artist, loading, error, refetch } = useArtist(id);
  const {
    updateArtist,
    loading: updating,
    error: updateError,
  } = useUpdateArtist(id, refetch);
  const { deleteArtist, loading: deleting } = useDeleteArtist();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex items-center gap-2 text-destructive py-8">
        <AlertCircle size={16} /> {error ?? "Artist not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/artists">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={15} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{artist.name}</h1>
            <p className="text-xs text-muted-foreground">{artist.slug}</p>
          </div>
          {artist.needsReview && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle size={11} /> Needs review
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => updateArtist({ needsReview: !artist.needsReview })}
            disabled={updating}
          >
            <Flag size={14} />
            {artist.needsReview ? "Clear review" : "Flag review"}
          </Button>
          <ArtistMergeDialog artistId={id} artistName={artist.name} />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteArtist(id, artist.name)}
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
          <ArtistForm
            defaultValues={artist}
            onSubmit={(data) => updateArtist(data as UpdateArtistSchema)}
            loading={updating}
            error={updateError}
            submitLabel="Update artist"
          />
        </CardContent>
      </Card>

      {/* Aliases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aliases</CardTitle>
        </CardHeader>
        <CardContent>
          <ArtistAliasesPanel
            artistId={id}
            aliases={artist.aliases}
            onUpdate={refetch}
          />
        </CardContent>
      </Card>

      {/* Genres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Genres</CardTitle>
        </CardHeader>
        <CardContent>
          <ArtistGenresPanel
            artistId={id}
            genres={artist.genres}
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
          <ArtistExternalIdsPanel
            artistId={id}
            externalIds={artist.externalIds}
            onUpdate={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
}
