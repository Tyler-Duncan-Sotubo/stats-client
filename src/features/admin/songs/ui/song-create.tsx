"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCreateSong } from "../hooks/use-create-song";
import { SongForm } from "./song-form";

export function SongCreate() {
  const { createSong, loading, error } = useCreateSong();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/songs">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={15} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add song</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new song record
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Song details</CardTitle>
        </CardHeader>
        <CardContent>
          <SongForm
            onSubmit={createSong}
            loading={loading}
            error={error}
            submitLabel="Create song"
          />
        </CardContent>
      </Card>
    </div>
  );
}
