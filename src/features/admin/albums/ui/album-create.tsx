"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateAlbum } from "../hooks/use-create-album";
import { AlbumForm } from "./album-form";

export function AlbumCreate() {
  const { createAlbum, loading, error } = useCreateAlbum();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/albums">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add album</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new album record
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Album details</CardTitle>
        </CardHeader>
        <CardContent>
          <AlbumForm
            onSubmit={createAlbum}
            loading={loading}
            error={error}
            submitLabel="Create album"
          />
        </CardContent>
      </Card>
    </div>
  );
}
