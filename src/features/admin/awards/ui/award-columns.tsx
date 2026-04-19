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
import type { Award } from "../types/award.types";

const resultStyle: Record<string, string> = {
  won: "bg-primary/10 text-primary border-primary/20",
  nominated: "bg-muted text-muted-foreground border-border",
};

export const awardColumns: ColumnDef<Award>[] = [
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
      <p className="font-medium">{row.original.artistName ?? "—"}</p>
    ),
  },

  // ── Award body ───────────────────────────────────────────────────────────────
  {
    accessorKey: "awardBody",
    header: "Body",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.awardBody}</span>
    ),
  },

  // ── Award name ───────────────────────────────────────────────────────────────
  {
    accessorKey: "awardName",
    header: "Award",
    cell: ({ row }) => (
      <span className="text-sm truncate max-w-[180px] block">
        {row.original.awardName}
      </span>
    ),
  },

  // ── Category ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground truncate max-w-[160px] block">
        {row.original.category}
      </span>
    ),
  },

  // ── Result ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${resultStyle[row.original.result] ?? ""}`}
      >
        {row.original.result}
      </span>
    ),
  },

  // ── Year ─────────────────────────────────────────────────────────────────────
  {
    accessorKey: "year",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year
        <ArrowUpDown size={13} />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.year}</span>
    ),
  },

  // ── Territory ────────────────────────────────────────────────────────────────
  {
    accessorKey: "territory",
    header: "Territory",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.territory ?? "—"}
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
            <Link href={`/admin/awards/${row.original.id}`}>Edit</Link>
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
