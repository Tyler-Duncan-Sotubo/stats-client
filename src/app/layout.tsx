import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/lib/providers/session-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";
import Script from "next/script";

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
            {/* Google Analytics — skip if loaded in iframe */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-4YWCN1HRXE"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                if (window.self === window.top) {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-4YWCN1HRXE');
                }
              `}
            </Script>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
