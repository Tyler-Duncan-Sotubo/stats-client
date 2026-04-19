"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateArtist } from "../hooks/use-create-artist";
import { ArtistForm } from "./artist-form";

export function ArtistCreate() {
  const { createArtist, loading, error } = useCreateArtist();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/artists">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add artist</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new artist record
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Artist details</CardTitle>
        </CardHeader>
        <CardContent>
          <ArtistForm
            onSubmit={createArtist as any}
            loading={loading}
            error={error}
            submitLabel="Create artist"
          />
        </CardContent>
      </Card>
    </div>
  );
}
