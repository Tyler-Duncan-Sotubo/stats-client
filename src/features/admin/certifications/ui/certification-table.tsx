"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/ui/data-table";
import { Button } from "@/shared/ui/button";
import { certificationColumns } from "./certification-columns";
import type {
  Certification,
  CertificationMeta,
} from "../types/certification.types";

interface CertificationTableProps {
  certifications: Certification[];
  meta: CertificationMeta;
  loading: boolean;
  error: string | null;
  onPage: (page: number) => void;
  onBulkResolve?: (ids: string[], status: string) => void;
}

export function CertificationTable({
  certifications,
  meta,
  loading,
  error,
  onPage,
  onBulkResolve,
}: CertificationTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={certificationColumns}
      data={certifications}
      loading={loading}
      error={error}
      meta={meta}
      onPage={onPage}
      selectable
      columnToggle
      emptyMessage="No certifications found"
      onRowClick={(cert) => router.push(`/admin/certifications/${cert.id}`)}
      bulkActions={(selected, clear) => (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onBulkResolve?.(
                selected.map((c) => c.id),
                "matched",
              );
              clear();
            }}
          >
            Mark matched
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onBulkResolve?.(
                selected.map((c) => c.id),
                "unresolved",
              );
              clear();
            }}
          >
            Mark unresolved
          </Button>
        </>
      )}
    />
  );
}
