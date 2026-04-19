"use client";

import Link from "next/link";
import { Badge } from "@/shared/ui/badge";
import { ExternalLink } from "lucide-react";
import type { AlbumSong } from "../types/album.types";

function formatDuration(ms: number | null): string {
  if (!ms) return "—";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface AlbumSongsPanelProps {
  songs: AlbumSong[];
}

export function AlbumSongsPanel({ songs }: AlbumSongsPanelProps) {
  if (songs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No songs linked to this album yet.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted/50 group"
        >
          <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{song.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {song.explicit && (
              <Badge variant="outline" className="text-xs h-4">
                E
              </Badge>
            )}
            {song.isAfrobeats && (
              <Badge variant="secondary" className="text-xs h-4">
                Afrobeats
              </Badge>
            )}
            <span className="text-xs text-muted-foreground font-mono">
              {formatDuration(song.durationMs)}
            </span>
            {song.spotifyTrackId && (
              <a
                href={`https://open.spotify.com/track/${song.spotifyTrackId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink
                  size={13}
                  className="text-muted-foreground hover:text-primary"
                />
              </a>
            )}
            <Link
              href={`/admin/songs/${song.id}`}
              className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
