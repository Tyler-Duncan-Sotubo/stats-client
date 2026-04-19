"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { RegisterSchema } from "../schema/register.schema";

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function register(values: RegisterSchema) {
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Registration failed");
        return;
      }

      // Auto login after successful registration
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong — please try again");
    }
  }

  return { register, error };
}
