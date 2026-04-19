"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Badge } from "@/shared/ui/badge";
import {
  AlertCircle,
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import type { Song } from "../types/song.types";

const statusStyle: Record<string, string> = {
  canonical: "bg-primary/10 text-primary border-primary/20",
  provisional: "bg-amber-100 text-amber-700 border-amber-200",
  merged: "bg-muted text-muted-foreground border-border",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

function formatDuration(ms: number | null): string {
  if (!ms) return "—";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const songColumns: ColumnDef<Song>[] = [
  // ── Select ──────────────────────────────────────────────────────────────────
  {
    id: "select",
    size: 40,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
  },

  // ── Title ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "title",
    enableHiding: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown size={13} />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-medium truncate">{row.original.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {row.original.slug}
        </p>
      </div>
    ),
  },

  // ── Release date ─────────────────────────────────────────────────────────────
  {
    accessorKey: "releaseDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Released
        <ArrowUpDown size={13} />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.releaseDate ?? "—"}
      </span>
    ),
  },

  // ── Duration ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "durationMs",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground font-mono">
        {formatDuration(row.original.durationMs)}
      </span>
    ),
  },

  // ── Status ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "entityStatus",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle[row.original.entityStatus] ?? ""}`}
      >
        {row.original.entityStatus}
      </span>
    ),
  },

  // ── Flags ────────────────────────────────────────────────────────────────────
  {
    id: "flags",
    header: "Flags",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        {row.original.isAfrobeats && (
          <Badge variant="secondary" className="text-xs">
            Afrobeats
          </Badge>
        )}
        {row.original.explicit && (
          <Badge variant="outline" className="text-xs">
            E
          </Badge>
        )}
      </div>
    ),
  },

  // ── Spotify ──────────────────────────────────────────────────────────────────
  {
    accessorKey: "spotifyTrackId",
    header: "Spotify",
    cell: ({ row }) =>
      row.original.spotifyTrackId ? (
        <a
          href={`https://open.spotify.com/track/${row.original.spotifyTrackId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Open <ExternalLink size={11} />
        </a>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },

  // ── Needs review ─────────────────────────────────────────────────────────────
  {
    accessorKey: "needsReview",
    header: "Review",
    size: 70,
    cell: ({ row }) =>
      row.original.needsReview ? (
        <AlertCircle size={15} className="text-destructive" />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },

  // ── Actions ──────────────────────────────────────────────────────────────────
  {
    id: "actions",
    size: 50,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/admin/songs/${row.original.id}`}>Edit</Link>
          </DropdownMenuItem>
          {row.original.spotifyTrackId && (
            <DropdownMenuItem asChild>
              <a
                href={`https://open.spotify.com/track/${row.original.spotifyTrackId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Spotify
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
