// features/auth/hooks/use-reset-password.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useResetPassword() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function resetPassword(token: string, password: string) {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong — please try again");
    }
  }

  return { resetPassword, error, success };
}
