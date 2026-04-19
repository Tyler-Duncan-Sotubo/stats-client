// features/auth/hooks/use-forgot-password.ts
"use client";

import { useState } from "react";

export function useForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function forgotPassword(email: string) {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong — please try again");
    }
  }

  return { forgotPassword, error, success };
}
