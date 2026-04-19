"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { albumsApi } from "../api/albums.api";
import type { AlbumWithSongs } from "../types/album.types";

export function useAlbum(id: string) {
  const axios = useAxiosAuth();
  const api = albumsApi(axios);

  const [album, setAlbum] = useState<AlbumWithSongs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(id);
      setAlbum(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load album";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { album, loading, error, refetch: fetch };
}
