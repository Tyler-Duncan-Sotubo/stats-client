"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRecord } from "../hooks/use-record";
import { useUpdateRecord } from "../hooks/use-update-record";
import { useDeleteRecord } from "../hooks/use-delete-record";
import { RecordForm } from "./record-form";
import { BreakRecordDialog } from "./break-record-dialog";

interface RecordDetailProps {
  id: string;
}

export function RecordDetail({ id }: RecordDetailProps) {
  const { record, loading, error, refetch } = useRecord(id);
  const {
    updateRecord,
    loading: updating,
    error: updateError,
  } = useUpdateRecord(id, refetch);
  const { deleteRecord, loading: deleting } = useDeleteRecord();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex items-center gap-2 text-destructive py-8">
        <AlertCircle size={16} /> {error ?? "Record not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/records">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={15} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{record.recordType}</h1>
              {record.isActive ? (
                <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  Broken
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {record.artistName} · {record.scope}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {record.isActive && (
            <BreakRecordDialog
              recordId={id}
              recordValue={record.recordValue}
              onSuccess={refetch}
            />
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteRecord(id)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RecordForm
            defaultValues={record}
            onSubmit={updateRecord}
            loading={updating}
            error={updateError}
            submitLabel="Update record"
          />
        </CardContent>
      </Card>
    </div>
  );
}
