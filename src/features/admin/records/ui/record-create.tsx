"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateRecord } from "../hooks/use-create-record";
import { RecordForm } from "./record-form";

export function RecordCreate() {
  const { createRecord, loading, error } = useCreateRecord();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/records">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add record</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new milestone record
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Record details</CardTitle>
        </CardHeader>
        <CardContent>
          <RecordForm
            onSubmit={createRecord}
            loading={loading}
            error={error}
            submitLabel="Create record"
          />
        </CardContent>
      </Card>
    </div>
  );
}
