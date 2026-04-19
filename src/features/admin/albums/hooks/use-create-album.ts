"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { albumsApi } from "../api/albums.api";
import type {
  CreateAlbumSchema,
  CreateAlbumSchemaInput,
} from "../schema/album.schema";

export function useCreateAlbum() {
  const axios = useAxiosAuth();
  const api = albumsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createAlbum(payload: CreateAlbumSchemaInput) {
    setLoading(true);
    setError(null);
    try {
      const album = await api.create(payload as CreateAlbumSchema);
      toast.success(`Album "${album.title}" created`);
      router.push(`/admin/albums/${album.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to create album";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { createAlbum, loading, error };
}
