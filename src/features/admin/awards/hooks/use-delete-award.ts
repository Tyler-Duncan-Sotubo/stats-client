"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { awardsApi } from "../api/awards.api";

export function useDeleteAward() {
  const axios = useAxiosAuth();
  const api = awardsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteAward(id: string) {
    setLoading(true);
    try {
      await api.delete(id);
      toast.success("Award deleted");
      router.push("/admin/awards");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete award";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return { deleteAward, loading };
}
