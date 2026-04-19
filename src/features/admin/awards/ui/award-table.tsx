"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/ui/data-table";
import { awardColumns } from "./award-columns";
import type { Award, AwardMeta } from "../types/award.types";

interface AwardTableProps {
  awards: Award[];
  meta: AwardMeta;
  loading: boolean;
  error: string | null;
  onPage: (page: number) => void;
}

export function AwardTable({
  awards,
  meta,
  loading,
  error,
  onPage,
}: AwardTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={awardColumns}
      data={awards}
      loading={loading}
      error={error}
      meta={meta}
      onPage={onPage}
      selectable
      columnToggle
      emptyMessage="No awards found"
      onRowClick={(award) => router.push(`/admin/awards/${award.id}`)}
    />
  );
}
