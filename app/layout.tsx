import "./globals.css";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalsProvider } from "@/components/providers/modals-provider";

export const metadata: Metadata = {
  title: "Reddit clone - Dive into anything",
  description: "Reddit clone made by Sajawal Hassan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-[#DAE0E6] dark:bg-black">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="reddit-clone-theme">
            <ModalsProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
