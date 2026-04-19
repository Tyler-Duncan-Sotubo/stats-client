"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { recordsApi } from "../api/records.api";

export function useDeleteRecord() {
  const axios = useAxiosAuth();
  const api = recordsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteRecord(id: string) {
    setLoading(true);
    try {
      await api.delete(id);
      toast.success("Record deleted");
      router.push("/admin/records");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete record";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return { deleteRecord, loading };
}
