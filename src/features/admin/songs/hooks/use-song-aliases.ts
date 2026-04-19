"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";
import type { CreateSongAliasSchema } from "../schema/song.schema";

export function useSongAliases(songId: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = songsApi(axios);
  const [loading, setLoading] = useState(false);

  async function addAlias(payload: CreateSongAliasSchema) {
    setLoading(true);
    try {
      await api.addAlias(songId, payload);
      toast.success("Alias added");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to add alias";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  async function setPrimary(aliasId: string) {
    setLoading(true);
    try {
      await api.setPrimaryAlias(songId, aliasId);
      toast.success("Primary alias updated");
      onSuccess?.();
    } catch {
      toast.error("Failed to update primary alias");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAlias(aliasId: string) {
    setLoading(true);
    try {
      await api.deleteAlias(songId, aliasId);
      toast.success("Alias removed");
      onSuccess?.();
    } catch {
      toast.error("Failed to remove alias");
    } finally {
      setLoading(false);
    }
  }

  return { addAlias, setPrimary, deleteAlias, loading };
}
