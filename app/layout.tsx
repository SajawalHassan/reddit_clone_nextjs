import "./globals.css";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalsProvider } from "@/components/providers/modals-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Reddit clone - Dive into anything",
  description: "Reddit clone made by Sajawal Hassan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-[#DAE0E6] dark:bg-black" suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="reddit-clone-theme">
            <ModalsProvider />
            <QueryProvider>
              {children}
              <Analytics />
              <SpeedInsights />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
