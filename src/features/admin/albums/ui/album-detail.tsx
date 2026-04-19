"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { useAlbum } from "../hooks/use-album";
import { useUpdateAlbum } from "../hooks/use-update-album";
import { useDeleteAlbum } from "../hooks/use-delete-album";
import { AlbumForm } from "./album-form";
import { AlbumSongsPanel } from "./album-songs-panel";
import type { UpdateAlbumSchema } from "../schema/album.schema";

interface AlbumDetailProps {
  id: string;
}

export function AlbumDetail({ id }: AlbumDetailProps) {
  const { album, loading, error, refetch } = useAlbum(id);
  const {
    updateAlbum,
    loading: updating,
    error: updateError,
  } = useUpdateAlbum(id, refetch);
  const { deleteAlbum, loading: deleting } = useDeleteAlbum();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex items-center gap-2 text-destructive py-8">
        <AlertCircle size={16} /> {error ?? "Album not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/albums">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={15} />
            </Button>
          </Link>
          {album.imageUrl && (
            <img
              src={album.imageUrl}
              alt={album.title}
              className="h-12 w-12 rounded-md object-cover shrink-0"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{album.title}</h1>
            <p className="text-xs text-muted-foreground">
              {album.artistName ?? album.artistId} · {album.albumType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://open.spotify.com/album/${album.spotifyAlbumId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink size={14} /> Spotify
            </Button>
          </a>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteAlbum(id, album.title)}
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
          <AlbumForm
            defaultValues={album}
            onSubmit={(data) => updateAlbum(data as UpdateAlbumSchema)}
            loading={updating}
            error={updateError}
            submitLabel="Update album"
          />
        </CardContent>
      </Card>

      {/* Songs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Songs
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {album.songs.length} tracks
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AlbumSongsPanel songs={album.songs} />
        </CardContent>
      </Card>
    </div>
  );
}
