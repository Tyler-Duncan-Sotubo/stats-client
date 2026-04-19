"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { BulkUpload } from "@/shared/ui/bulk-upload";
import { useRouter } from "next/navigation";

const EXPECTED_COLUMNS = [
  "artistName",
  "awardBody",
  "awardName",
  "category",
  "result",
  "year",
  "ceremony",
  "territory",
  "sourceUrl",
  "notes",
];

export function AwardBulkUpload() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/awards">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Bulk import awards</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload a CSV or Excel file to create multiple awards at once
          </p>
        </div>
      </div>

      {/* Column guide */}
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
              • <strong>result</strong> must be <code>won</code> or{" "}
              <code>nominated</code>
            </p>
            <p>
              • <strong>year</strong> must be a 4-digit year e.g.{" "}
              <code>2021</code>
            </p>
            <p>
              • <strong>artistName</strong> must exactly match an artist in the
              system
            </p>
            <p>
              • Duplicate entries (same artist + body + name + year) are skipped
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload file</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkUpload
            endpoint="/api/awards/bulk"
            maxRows={500}
            onSuccess={() => {
              setTimeout(() => router.push("/admin/awards"), 2000);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
