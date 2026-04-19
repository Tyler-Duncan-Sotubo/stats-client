"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useAward } from "../hooks/use-award";
import { useUpdateAward } from "../hooks/use-update-award";
import { useDeleteAward } from "../hooks/use-delete-award";
import { AwardForm } from "./award-form";

interface AwardDetailProps {
  id: string;
}

export function AwardDetail({ id }: AwardDetailProps) {
  const { award, loading, error, refetch } = useAward(id);
  const {
    updateAward,
    loading: updating,
    error: updateError,
  } = useUpdateAward(id, refetch);
  const { deleteAward, loading: deleting } = useDeleteAward();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !award) {
    return (
      <div className="flex items-center gap-2 text-destructive py-8">
        <AlertCircle size={16} /> {error ?? "Award not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/awards">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft size={15} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{award.awardName}</h1>
            <p className="text-xs text-muted-foreground">
              {award.artistName} · {award.awardBody} · {award.year}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteAward(id)}
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
          <AwardForm
            defaultValues={award}
            onSubmit={updateAward}
            loading={updating}
            error={updateError}
            submitLabel="Update award"
          />
        </CardContent>
      </Card>
    </div>
  );
}
