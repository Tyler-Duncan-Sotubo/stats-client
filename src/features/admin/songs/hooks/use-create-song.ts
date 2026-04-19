"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";
import type {
  CreateSongSchema,
  CreateSongSchemaInput,
} from "../schema/song.schema";

export function useCreateSong() {
  const axios = useAxiosAuth();
  const api = songsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createSong(payload: CreateSongSchemaInput) {
    setLoading(true);
    setError(null);
    try {
      const song = await api.create(payload as CreateSongSchema);
      toast.success(`Song "${song.title}" created`);
      router.push(`/admin/songs/${song.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to create song";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { createSong, loading, error };
}
