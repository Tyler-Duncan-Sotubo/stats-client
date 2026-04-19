"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { songsApi } from "../api/songs.api";

export function useDeleteSong() {
  const axios = useAxiosAuth();
  const api = songsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteSong(id: string, title: string) {
    setLoading(true);
    try {
      await api.delete(id);
      toast.success(`Song "${title}" deleted`);
      router.push("/admin/songs");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete song";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return { deleteSong, loading };
}
