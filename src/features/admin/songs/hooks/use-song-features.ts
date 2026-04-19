"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";
import type { CreateSongFeatureSchema } from "../schema/song.schema";

export function useSongFeatures(songId: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = songsApi(axios);
  const [loading, setLoading] = useState(false);

  async function addFeature(payload: CreateSongFeatureSchema) {
    setLoading(true);
    try {
      await api.addFeature(songId, payload);
      toast.success("Featured artist added");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to add feature";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  async function deleteFeature(featuredArtistId: string) {
    setLoading(true);
    try {
      await api.deleteFeature(songId, featuredArtistId);
      toast.success("Featured artist removed");
      onSuccess?.();
    } catch {
      toast.error("Failed to remove featured artist");
    } finally {
      setLoading(false);
    }
  }

  return { addFeature, deleteFeature, loading };
}
