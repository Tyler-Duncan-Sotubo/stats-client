"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ArrowUpDown, ExternalLink, MoreHorizontal } from "lucide-react";
import type { Album } from "../types/album.types";

const albumTypeStyle: Record<string, string> = {
  album: "bg-primary/10 text-primary border-primary/20",
  single: "bg-muted text-muted-foreground border-border",
  ep: "bg-purple-100 text-purple-700 border-purple-200",
  compilation: "bg-amber-100 text-amber-700 border-amber-200",
};

export const albumColumns: ColumnDef<Album>[] = [
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
      <div className="flex items-center gap-3 min-w-0">
        {row.original.imageUrl && (
          <img
            src={row.original.imageUrl}
            alt={row.original.title}
            className="h-9 w-9 rounded object-cover shrink-0"
          />
        )}
        <div className="min-w-0">
          <p className="font-medium truncate">{row.original.title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {row.original.artistName ?? row.original.artistId}
          </p>
        </div>
      </div>
    ),
  },

  // ── Type ─────────────────────────────────────────────────────────────────────
  {
    accessorKey: "albumType",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${albumTypeStyle[row.original.albumType] ?? ""}`}
      >
        {row.original.albumType}
      </span>
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

  // ── Tracks ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "totalTracks",
    header: "Tracks",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.totalTracks ?? "—"}
      </span>
    ),
  },

  // ── Afrobeats ────────────────────────────────────────────────────────────────
  {
    accessorKey: "isAfrobeats",
    header: "Afrobeats",
    cell: ({ row }) =>
      row.original.isAfrobeats ? (
        <Badge variant="secondary" className="text-xs">
          Yes
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },

  // ── Spotify ──────────────────────────────────────────────────────────────────
  {
    accessorKey: "spotifyAlbumId",
    header: "Spotify",
    cell: ({ row }) => (
      <a
        href={`https://open.spotify.com/album/${row.original.spotifyAlbumId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        Open <ExternalLink size={11} />
      </a>
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
            <Link href={`/admin/albums/${row.original.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://open.spotify.com/album/${row.original.spotifyAlbumId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Spotify
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
