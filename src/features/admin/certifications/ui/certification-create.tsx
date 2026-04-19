"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateCertification } from "../hooks/use-create-certification";
import { CertificationForm } from "./certification-form";

export function CertificationCreate() {
  const { createCertification, loading, error } = useCreateCertification();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/certifications">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add certification</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new certification record
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Certification details</CardTitle>
        </CardHeader>
        <CardContent>
          <CertificationForm
            onSubmit={createCertification}
            loading={loading}
            error={error}
            submitLabel="Create certification"
          />
        </CardContent>
      </Card>
    </div>
  );
}
