import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth/auth-options";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (session) redirect("/admin");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {children}
    </main>
  );
}
