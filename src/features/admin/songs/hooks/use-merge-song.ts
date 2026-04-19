"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";

export function useMergeSong(sourceId: string) {
  const axios = useAxiosAuth();
  const api = songsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mergeSong(targetSongId: string) {
    setLoading(true);
    setError(null);
    try {
      await api.merge(sourceId, targetSongId);
      toast.success("Song merged successfully");
      router.push("/admin/songs");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to merge song";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { mergeSong, loading, error };
}
