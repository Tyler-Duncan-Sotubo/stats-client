"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";
import type { UpdateArtistSchema } from "../schema/artist.schema";

export function useUpdateArtist(id: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateArtist(payload: UpdateArtistSchema) {
    setLoading(true);
    setError(null);
    try {
      await api.update(id, payload);
      toast.success("Artist updated");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update artist";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { updateArtist, loading, error };
}
