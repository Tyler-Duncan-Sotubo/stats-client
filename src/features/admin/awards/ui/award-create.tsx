"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateAward } from "../hooks/use-create-award";
import { AwardForm } from "./award-form";

export function AwardCreate() {
  const { createAward, loading, error } = useCreateAward();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/awards">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add award</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new award record
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Award details</CardTitle>
        </CardHeader>
        <CardContent>
          <AwardForm
            onSubmit={createAward}
            loading={loading}
            error={error}
            submitLabel="Create award"
          />
        </CardContent>
      </Card>
    </div>
  );
}
