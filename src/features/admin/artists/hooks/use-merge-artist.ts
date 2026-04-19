"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";

export function useMergeArtist(sourceId: string) {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mergeArtist(targetArtistId: string) {
    setLoading(true);
    setError(null);
    try {
      await api.merge(sourceId, targetArtistId);
      toast.success("Artist merged successfully");
      router.push("/admin/artists");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to merge artist";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { mergeArtist, loading, error };
}
