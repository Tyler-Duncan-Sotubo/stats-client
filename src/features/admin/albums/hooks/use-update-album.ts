"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { albumsApi } from "../api/albums.api";
import type { UpdateAlbumSchema } from "../schema/album.schema";

export function useUpdateAlbum(id: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = albumsApi(axios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateAlbum(payload: UpdateAlbumSchema) {
    setLoading(true);
    setError(null);
    try {
      await api.update(id, payload);
      toast.success("Album updated");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update album";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { updateAlbum, loading, error };
}
