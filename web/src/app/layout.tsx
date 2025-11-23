import type { Metadata } from "next";
import { Nunito, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { SupabaseProvider } from "@/components/providers/supabase-provider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatspheres — Talk with purpose. Connect with heart.",
  description:
    "Discover topic-driven spheres, host live video salons, and replay meaningful conversations with Chatspheres.",
  metadataBase: new URL("https://chatspheres.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${geistMono.variable} antialiased`}>
        <SupabaseProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
              <div className="soft-grid absolute inset-0" />
              <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-[#FFB6B9] blur-3xl opacity-40" />
              <div className="absolute -bottom-32 left-10 h-[520px] w-[520px] rounded-full bg-[#FFD166] blur-3xl opacity-30" />
            </div>
            {children}
            <Analytics />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
