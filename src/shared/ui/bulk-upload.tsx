"use client";

import { useState, useRef } from "react";
import { Button } from "@/shared/ui/button";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";

interface BulkUploadResult {
  inserted: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

interface BulkUploadProps {
  endpoint: string;
  templateUrl?: string;
  templateName?: string;
  onSuccess?: (result: BulkUploadResult) => void;
  maxRows?: number;
}

export function BulkUpload({
  endpoint,
  templateUrl,
  templateName,
  onSuccess,
  maxRows = 500,
}: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const axios = useAxiosAuth();

  function handleFile(f: File) {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xls", "xlsx"].includes(ext ?? "")) {
      setError("Only CSV, XLS or XLSX files are supported");
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(data);
      onSuccess?.(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Upload failed";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      {!result && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet size={20} className="text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload size={24} className="mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">
                Drop a CSV or Excel file here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse — max {maxRows} rows
              </p>
            </div>
          )}
        </div>
      )}

      {templateUrl && !result && (
        <p className="text-xs text-muted-foreground">
          Need a template?{" "}
          <a
            href={templateUrl}
            download={templateName}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Download {templateName ?? "template.csv"}
          </a>
        </p>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
            <CheckCircle size={15} className="text-primary shrink-0" />
            <span>
              <strong>{result.inserted}</strong> inserted,{" "}
              <strong>{result.skipped}</strong> skipped
            </span>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-lg border overflow-hidden">
              <div className="px-3 py-2 bg-muted/50 text-xs font-medium text-muted-foreground">
                {result.errors.length} row errors
              </div>
              <div className="divide-y max-h-48 overflow-y-auto">
                {result.errors.map((e) => (
                  <div key={e.row} className="flex gap-3 px-3 py-2 text-xs">
                    <span className="text-muted-foreground shrink-0">
                      Row {e.row}
                    </span>
                    <span className="text-destructive">{e.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={reset}>
            Upload another file
          </Button>
        </div>
      )}

      {file && !result && (
        <Button onClick={handleUpload} disabled={loading} className="w-full">
          {loading ? "Uploading..." : `Upload ${file.name}`}
        </Button>
      )}
    </div>
  );
}
