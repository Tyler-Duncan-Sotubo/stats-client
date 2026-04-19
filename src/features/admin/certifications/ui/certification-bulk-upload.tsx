"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { BulkUpload } from "@/shared/ui/bulk-upload";
import { useRouter } from "next/navigation";

const EXPECTED_COLUMNS = [
  "artistName",
  "title",
  "level",
  "territory",
  "body",
  "units",
  "certifiedAt",
  "sourceUrl",
];

export function CertificationBulkUpload() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/certifications">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Bulk import certifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload a CSV or Excel file to create multiple certifications at once
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
              • <strong>level</strong> must be <code>diamond</code>,{" "}
              <code>platinum</code>, <code>gold</code> or <code>silver</code>
            </p>
            <p>
              • <strong>certifiedAt</strong> format: <code>YYYY-MM-DD</code>
            </p>
            <p>
              • <strong>artistName</strong> must exactly match an artist in the
              system
            </p>
            <p>• Duplicate entries are skipped automatically</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload file</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkUpload
            endpoint="/api/certifications/bulk"
            maxRows={500}
            onSuccess={() => {
              setTimeout(() => router.push("/admin/certifications"), 2000);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
