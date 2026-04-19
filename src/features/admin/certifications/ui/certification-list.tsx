"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { useCertifications } from "../hooks/use-certifications";
import { CertificationFilters } from "./certification-filters";
import { CertificationTable } from "./certification-table";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { certificationsApi } from "../api/certifications.api";

export function CertificationList() {
  const { data, loading, error, query, updateQuery, setPage, refetch } =
    useCertifications();

  const axios = useAxiosAuth();
  const api = certificationsApi(axios);

  async function handleBulkResolve(ids: string[], status: string) {
    try {
      await api.bulkResolve(ids, status);
      toast.success(`${ids.length} certifications updated`);
      refetch();
    } catch {
      toast.error("Failed to update certifications");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Certifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.meta.total.toLocaleString() ?? "—"} total certifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/certifications/new">
            <Button size="sm" className="gap-1.5">
              <Plus size={15} /> Add certification
            </Button>
          </Link>
          <Link href="/admin/certifications/bulk">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload size={15} /> Bulk import
            </Button>
          </Link>
        </div>
      </div>

      <CertificationFilters query={query} onUpdate={updateQuery} />

      <CertificationTable
        certifications={data?.data ?? []}
        meta={data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 }}
        loading={loading}
        error={error}
        onPage={setPage}
        onBulkResolve={handleBulkResolve}
      />
    </div>
  );
}
