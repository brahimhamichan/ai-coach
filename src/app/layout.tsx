import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AlertProvider } from "@/components/AlertContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Coach",
  description: "Call-first execution coaching for ADHD entrepreneurs",
};

import { Navigation } from "@/components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertProvider>
            <ConvexAuthNextjsServerProvider>
              <ConvexClientProvider>
                <Navigation />
                {children}
              </ConvexClientProvider>
            </ConvexAuthNextjsServerProvider>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
