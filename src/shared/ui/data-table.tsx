"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
} from "lucide-react";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  loading?: boolean;
  error?: string | null;
  meta?: PaginationMeta;
  onPage?: (page: number) => void;
  clientPagination?: boolean;
  pageSize?: number;
  selectable?: boolean;
  onRowSelection?: (rows: TData[]) => void;
  bulkActions?: (
    selectedRows: TData[],
    clearSelection: () => void,
  ) => React.ReactNode;
  onRowClick?: (row: TData) => void;
  columnToggle?: boolean;
  emptyMessage?: string;
  showResultsCount?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  loading,
  error,
  meta,
  onPage,
  clientPagination,
  pageSize = 20,
  selectable,
  onRowSelection,
  bulkActions,
  onRowClick,
  columnToggle,
  emptyMessage = "No results found",
  showResultsCount = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const isServerPaginated = !!meta && !!onPage;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onRowSelection) {
        const selected = Object.keys(next)
          .filter((k) => next[k])
          .map((k) => data[Number(k)])
          .filter(Boolean);
        onRowSelection(selected);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: clientPagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: isServerPaginated,
    pageCount: isServerPaginated ? meta.totalPages : undefined,
    initialState: {
      pagination: { pageSize },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
  const selectedCount = selectedRows.length;

  function clearSelection() {
    setRowSelection({});
  }

  return (
    <div className="space-y-4">
      {/* Column visibility toggle */}
      {columnToggle && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <Settings2 size={14} /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Bulk action bar */}
      {selectable && bulkActions && selectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium text-primary">
            {selectedCount} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {bulkActions(selectedRows, clearSelection)}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-muted-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-destructive text-center py-8">{error}</div>
      )}

      {/* Table */}
      {!error && (
        <div className="rounded-lg border overflow-hidden ">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-sm font-semibold"
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="bg-white">
              {loading ? (
                Array.from({ length: pageSize > 10 ? 10 : pageSize }).map(
                  (_, i) => (
                    <TableRow key={i}>
                      {columns.map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full max-w-35" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ),
                )
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                    className={onRowClick ? "cursor-pointer" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 max-w-50">
                        <div className="truncate">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && showResultsCount && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {isServerPaginated ? (
            <p>
              {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)} of{" "}
              {meta.total.toLocaleString()} results
            </p>
          ) : (
            <p>
              {table.getFilteredRowModel().rows.length.toLocaleString()} results
            </p>
          )}

          {isServerPaginated ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={meta.page <= 1}
                onClick={() => onPage(1)}
              >
                <ChevronsLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={meta.page <= 1}
                onClick={() => onPage(meta.page - 1)}
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="px-3 text-xs">
                {meta.page} / {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={meta.page >= meta.totalPages}
                onClick={() => onPage(meta.page + 1)}
              >
                <ChevronRight size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={meta.page >= meta.totalPages}
                onClick={() => onPage(meta.totalPages)}
              >
                <ChevronsRight size={14} />
              </Button>
            </div>
          ) : clientPagination ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.firstPage()}
              >
                <ChevronsLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="px-3 text-xs">
                {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <ChevronRight size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!table.getCanNextPage()}
                onClick={() => table.lastPage()}
              >
                <ChevronsRight size={14} />
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
