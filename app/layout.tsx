import "./globals.css";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "Reddit clone",
  description: "Reddit clone made by Sajawal Hassan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning className="bg-[#DAE0E6] dark:bg-black">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="reddit-clone-theme">
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
