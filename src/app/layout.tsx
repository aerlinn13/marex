import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/shared/error-boundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "MarexFX Trading Terminal",
  description:
    "Professional FX trading terminal built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="h-screen overflow-hidden bg-background font-sans antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ErrorBoundary>
          <main id="main-content" className="h-screen">
            {children}
          </main>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
