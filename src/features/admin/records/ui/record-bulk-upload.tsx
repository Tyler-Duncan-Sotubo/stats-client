"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { BulkUpload } from "@/shared/ui/bulk-upload";
import { useRouter } from "next/navigation";

const EXPECTED_COLUMNS = [
  "artistName",
  "recordType",
  "recordValue",
  "numericValue",
  "scope",
  "isActive",
  "setOn",
  "brokenOn",
  "notes",
];

export function RecordBulkUpload() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/records">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Bulk import records</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload a CSV or Excel file to create multiple records at once
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expected columns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {EXPECTED_COLUMNS.map((col) => (
              <code
                key={col}
                className="text-xs px-2 py-0.5 rounded bg-muted font-mono"
              >
                {col}
              </code>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
            <p>
              • <strong>artistName</strong> must exactly match an artist in the
              system
            </p>
            <p>
              • <strong>recordType</strong> use snake_case e.g.{" "}
              <code>first_billion_streams</code>
            </p>
            <p>
              • <strong>scope</strong> e.g. <code>nigeria</code>,{" "}
              <code>africa</code>, <code>global</code>
            </p>
            <p>
              • <strong>isActive</strong> defaults to <code>true</code> — set{" "}
              <code>false</code> for broken records
            </p>
            <p>
              • <strong>setOn</strong> and <strong>brokenOn</strong> format:{" "}
              <code>YYYY-MM-DD</code>
            </p>
            <p>
              • Duplicate entries (same artist + recordType + scope) are skipped
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload file</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkUpload
            endpoint="/api/records/bulk"
            maxRows={500}
            onSuccess={() => {
              setTimeout(() => router.push("/admin/records"), 2000);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
