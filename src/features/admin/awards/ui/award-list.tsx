"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Plus, Upload } from "lucide-react";
import { useAwards } from "../hooks/use-awards";
import { AwardFilters } from "./award-filters";
import { AwardTable } from "./award-table";

export function AwardList() {
  const { data, loading, error, query, updateQuery, setPage } = useAwards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Awards</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.meta.total.toLocaleString() ?? "—"} total awards
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/admin/awards/new">
            <Button size="sm" className="gap-1.5">
              <Plus size={15} /> Add award
            </Button>
          </Link>
          <Link href="/admin/awards/bulk">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload size={15} /> Bulk import
            </Button>
          </Link>
        </div>
      </div>

      <AwardFilters query={query} onUpdate={updateQuery} />

      <AwardTable
        awards={data?.data ?? []}
        meta={data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 }}
        loading={loading}
        error={error}
        onPage={setPage}
      />
    </div>
  );
}
