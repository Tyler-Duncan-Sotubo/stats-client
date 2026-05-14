import { Footer } from "@/features/public/layout/footer";
import { Navbar } from "@/features/public/layout/navbar";
import { Sidebar } from "@/features/public/layout/sidebar";
import { getAvailableCharts } from "@/lib/api/public";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const charts = await getAvailableCharts().catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar charts={charts} />
      <div className="flex flex-1">
        <Sidebar charts={charts} />
        <main className="flex-1 py-6 px-5 overflow-x-hidden">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
