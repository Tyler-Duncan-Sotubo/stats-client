import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/lib/providers/session-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Stats Engine",
  description: "African Music, By The Numbers",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <QueryProvider>
            <ScrollToTop />
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
