"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";
import type { UpdateSongSchema } from "../schema/song.schema";

export function useUpdateSong(id: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = songsApi(axios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateSong(payload: UpdateSongSchema) {
    setLoading(true);
    setError(null);
    try {
      await api.update(id, payload);
      toast.success("Song updated");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update song";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { updateSong, loading, error };
}
