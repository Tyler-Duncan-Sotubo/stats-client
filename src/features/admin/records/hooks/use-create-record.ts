"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { recordsApi } from "../api/records.api";
import type {
  CreateRecordSchema,
  CreateRecordSchemaInput,
} from "../schema/record.schema";

export function useCreateRecord() {
  const axios = useAxiosAuth();
  const api = recordsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createRecord(payload: CreateRecordSchemaInput) {
    setLoading(true);
    setError(null);
    try {
      const record = await api.create(payload as CreateRecordSchema);
      toast.success("Record created");
      router.push(`/admin/records/${record.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to create record";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { createRecord, loading, error };
}
