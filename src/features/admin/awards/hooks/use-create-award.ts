"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { awardsApi } from "../api/awards.api";
import type { CreateAwardSchema } from "../schema/award.schema";

export function useCreateAward() {
  const axios = useAxiosAuth();
  const api = awardsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createAward(payload: CreateAwardSchema) {
    setLoading(true);
    setError(null);
    try {
      const award = await api.create(payload);
      toast.success("Award created");
      router.push(`/admin/awards/${award.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to create award";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { createAward, loading, error };
}
