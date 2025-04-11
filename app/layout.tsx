import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingNavDemo from "@/components/floating-navbar-demo";
import { Suspense } from "react";
import ConnectionStatusClient from "@/components/ui/connection-status";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JoBless - Find Your Dream Job",
  description: "A job portal for finding the best opportunities",
};

// Simple loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FloatingNavDemo />
        <ConnectionStatusClient />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
