"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return { login, error };
}
