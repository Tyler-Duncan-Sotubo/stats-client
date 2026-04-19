"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useCertification } from "../hooks/use-certification";
import { useUpdateCertification } from "../hooks/use-update-certification";
import { useDeleteCertification } from "../hooks/use-delete-certification";
import { CertificationForm } from "./certification-form";

interface CertificationDetailProps {
  id: string;
}

export function CertificationDetail({ id }: CertificationDetailProps) {
  const { certification, loading, error, refetch } = useCertification(id);
  const {
    updateCertification,
    loading: updating,
    error: updateError,
  } = useUpdateCertification(id, refetch);
  const { deleteCertification, loading: deleting } = useDeleteCertification();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !certification) {
    return (
      <div className="flex items-center gap-2 text-destructive py-8">
        <AlertCircle size={16} /> {error ?? "Certification not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/certifications">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={15} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{certification.title}</h1>
            <p className="text-xs text-muted-foreground">
              {certification.artistName ?? certification.rawArtistName} ·{" "}
              {certification.level} · {certification.body} ·{" "}
              {certification.territory}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteCertification(id)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CertificationForm
            defaultValues={certification}
            onSubmit={updateCertification}
            loading={updating}
            error={updateError}
            submitLabel="Update certification"
          />
        </CardContent>
      </Card>
    </div>
  );
}
