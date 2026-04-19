"use client";
import { SessionProvider } from "next-auth/react";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/stats/api/auth">{children}</SessionProvider>
  );
}
