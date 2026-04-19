"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";
import type { SongWithRelations } from "../types/song.types";

export function useSong(id: string) {
  const axios = useAxiosAuth();
  const api = songsApi(axios);

  const [song, setSong] = useState<SongWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(id);
      setSong(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load song";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { song, loading, error, refetch: fetch };
}
