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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { Certification } from "../types/certification.types";

const levelStyle: Record<string, string> = {
  diamond: "bg-blue-100 text-blue-700 border-blue-200",
  platinum: "bg-slate-100 text-slate-700 border-slate-200",
  gold: "bg-amber-100 text-amber-700 border-amber-200",
  silver: "bg-gray-100 text-gray-600 border-gray-200",
};

const resolutionStyle: Record<string, string> = {
  matched: "bg-primary/10 text-primary border-primary/20",
  artist_only: "bg-amber-100 text-amber-700 border-amber-200",
  unresolved: "bg-destructive/10 text-destructive border-destructive/20",
};

export const certificationColumns: ColumnDef<Certification>[] = [
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

  // ── Artist ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "artistName",
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
      <p className="font-medium">
        {row.original.artistName ?? row.original.rawArtistName ?? "—"}
      </p>
    ),
  },

  // ── Title ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <p className="text-sm truncate max-w-[200px]">{row.original.title}</p>
    ),
  },

  // ── Level ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${levelStyle[row.original.level] ?? ""}`}
      >
        {row.original.level}
      </span>
    ),
  },

  // ── Territory ────────────────────────────────────────────────────────────────
  {
    accessorKey: "territory",
    header: "Territory",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground uppercase">
        {row.original.territory}
      </span>
    ),
  },

  // ── Body ─────────────────────────────────────────────────────────────────────
  {
    accessorKey: "body",
    header: "Body",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground uppercase">
        {row.original.body}
      </span>
    ),
  },

  // ── Units ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "units",
    header: "Units",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.units?.toLocaleString() ?? "—"}
      </span>
    ),
  },

  // ── Certified at ─────────────────────────────────────────────────────────────
  {
    accessorKey: "certifiedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Certified
        <ArrowUpDown size={13} />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.certifiedAt ?? "—"}
      </span>
    ),
  },

  // ── Resolution ───────────────────────────────────────────────────────────────
  {
    accessorKey: "resolutionStatus",
    header: "Resolution",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${resolutionStyle[row.original.resolutionStatus] ?? ""}`}
      >
        {row.original.resolutionStatus.replace("_", " ")}
      </span>
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
            <Link href={`/admin/certifications/${row.original.id}`}>Edit</Link>
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
