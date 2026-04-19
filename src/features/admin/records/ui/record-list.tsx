"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Plus, Upload } from "lucide-react";
import { useRecords } from "../hooks/use-records";
import { RecordFilters } from "./record-filters";
import { RecordTable } from "./record-table";

export function RecordList() {
  const { data, loading, error, query, updateQuery, setPage } = useRecords();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Records</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.meta.total.toLocaleString() ?? "—"} total records
          </p>
        </div>
        <div>
          <Link href="/admin/records/new">
            <Button size="sm" className="gap-1.5">
              <Plus size={15} /> Add record
            </Button>
          </Link>
          <Link href="/admin/records/bulk">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload size={15} /> Bulk import
            </Button>
          </Link>
        </div>
      </div>

      <RecordFilters query={query} onUpdate={updateQuery} />

      <RecordTable
        records={data?.data ?? []}
        meta={data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 }}
        loading={loading}
        error={error}
        onPage={setPage}
      />
    </div>
  );
}
