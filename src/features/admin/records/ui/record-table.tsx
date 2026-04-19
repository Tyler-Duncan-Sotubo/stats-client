"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/ui/data-table";
import { recordColumns } from "./record-columns";
import type { Record, RecordMeta } from "../types/record.types";

interface RecordTableProps {
  records: Record[];
  meta: RecordMeta;
  loading: boolean;
  error: string | null;
  onPage: (page: number) => void;
}

export function RecordTable({
  records,
  meta,
  loading,
  error,
  onPage,
}: RecordTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={recordColumns}
      data={records}
      loading={loading}
      error={error}
      meta={meta}
      onPage={onPage}
      selectable
      columnToggle
      emptyMessage="No records found"
      onRowClick={(record) => router.push(`/admin/records/${record.id}`)}
    />
  );
}
