"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";
import type { CreateSongExternalIdSchema } from "../schema/song.schema";

export function useSongExternalIds(songId: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = songsApi(axios);
  const [loading, setLoading] = useState(false);

  async function addExternalId(payload: CreateSongExternalIdSchema) {
    setLoading(true);
    try {
      await api.addExternalId(songId, payload);
      toast.success("External ID added");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to add external ID";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  async function deleteExternalId(externalIdId: string) {
    setLoading(true);
    try {
      await api.deleteExternalId(songId, externalIdId);
      toast.success("External ID removed");
      onSuccess?.();
    } catch {
      toast.error("Failed to remove external ID");
    } finally {
      setLoading(false);
    }
  }

  return { addExternalId, deleteExternalId, loading };
}
