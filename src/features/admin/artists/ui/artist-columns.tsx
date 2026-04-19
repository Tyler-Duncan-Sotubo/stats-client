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
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import type { Artist } from "../types/artist.types";

// ── Status styles ─────────────────────────────────────────────────────────────

const statusStyle: Record<string, string> = {
  canonical: "bg-primary/10 text-primary border-primary/20",
  provisional: "bg-amber-100 text-amber-700 border-amber-200",
  merged: "bg-muted text-muted-foreground border-border",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

// ── Columns ───────────────────────────────────────────────────────────────────

export const artistColumns: ColumnDef<Artist>[] = [
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

  // ── Name ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Artist
        <ArrowUpDown size={13} />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-medium truncate">{row.original.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {row.original.slug}
        </p>
      </div>
    ),
  },

  // ── Country ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "originCountry",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Country
        <ArrowUpDown size={13} />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.originCountry ?? "—"}
      </span>
    ),
  },

  // ── Status ──────────────────────────────────────────────────────────────────
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
    filterFn: (row, _, filterValue) =>
      filterValue === "all" || row.original.entityStatus === filterValue,
  },

  // ── Afrobeats ────────────────────────────────────────────────────────────────
  {
    accessorKey: "isAfrobeats",
    header: "Afrobeats",
    cell: ({ row }) =>
      row.original.isAfrobeats ? (
        <Badge variant="secondary" className="text-xs font-medium">
          Yes
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
    filterFn: (row, _, filterValue) => {
      if (filterValue === "all") return true;
      return row.original.isAfrobeats === (filterValue === "true");
    },
  },

  // ── Source ──────────────────────────────────────────────────────────────────
  {
    accessorKey: "sourceOfTruth",
    header: "Source",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs capitalize">
        {row.original.sourceOfTruth ?? "—"}
      </span>
    ),
  },

  // ── Spotify ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "spotifyId",
    header: "Spotify",
    cell: ({ row }) =>
      row.original.spotifyId ? (
        <a
          href={`https://open.spotify.com/artist/${row.original.spotifyId}`}
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

  // ── Needs review ────────────────────────────────────────────────────────────
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
    filterFn: (row, _, filterValue) => {
      if (filterValue === "all") return true;
      return row.original.needsReview === (filterValue === "true");
    },
  },

  // ── Actions ─────────────────────────────────────────────────────────────────
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
            <Link href={`/admin/artists/${row.original.id}`}>Edit</Link>
          </DropdownMenuItem>
          {row.original.spotifyId && (
            <DropdownMenuItem asChild>
              <a
                href={`https://open.spotify.com/artist/${row.original.spotifyId}`}
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
