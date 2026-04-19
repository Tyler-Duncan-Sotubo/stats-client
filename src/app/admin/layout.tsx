// app/(admin)/layout.tsx
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth/auth-options";
import { AdminSidebar } from "@/features/admin/ui/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar email={session.user.email ?? ""} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="h-14 bg-card flex items-center justify-between px-4 md:hidden">
          <h1 className="font-semibold text-sm">Stats Engine Admin</h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
