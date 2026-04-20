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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { Record } from "../types/record.types";

export const recordColumns: ColumnDef<Record>[] = [
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

  // ── Record type ──────────────────────────────────────────────────────────────
  {
    accessorKey: "recordType",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-sm font-mono text-muted-foreground">
        {row.original.recordType}
      </span>
    ),
  },

  // ── Record value ─────────────────────────────────────────────────────────────
  {
    accessorKey: "recordValue",
    header: "Value",
    cell: ({ row }) => (
      <p className="text-sm max-w-50 truncate">{row.original.recordValue}</p>
    ),
  },

  // ── Numeric value ────────────────────────────────────────────────────────────
  {
    accessorKey: "numericValue",
    header: "Numeric",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.numericValue?.toLocaleString() ?? "—"}
      </span>
    ),
  },

  // ── Scope ────────────────────────────────────────────────────────────────────
  {
    accessorKey: "scope",
    header: "Scope",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.scope}
      </span>
    ),
  },

  // ── Status ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge
          variant="secondary"
          className="text-xs bg-primary/10 text-primary border-primary/20"
        >
          Active
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Broken
        </Badge>
      ),
  },

  // ── Set on ───────────────────────────────────────────────────────────────────
  {
    accessorKey: "setOn",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Set on
        <ArrowUpDown size={13} />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.setOn ?? "—"}
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
            <Link href={`/admin/records/${row.original.id}`}>Edit</Link>
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
